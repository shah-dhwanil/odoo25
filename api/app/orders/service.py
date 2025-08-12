from datetime import timedelta
from uuid import UUID

from app.deliveries.models import CreateDelivery, DeliveryType
from app.deliveries.repository import DeliveryRepository
from app.deliveries.service import DeliveryService
from app.delivery_partner.repository import DeliveryPartnerRepository
from app.delivery_partner.service import DeliveryPartnerService
from app.orders.exceptions import (
    DeliveryServiceNotAvailable,
    InsufficientPayment,
    InsufficientStock,
    InvalidDeliveryDates,
    InvalidOrderStatus,
    InvalidPaymentStatus,
    InvalidRentDates,
    OrderNotCancellable,
)
from app.orders.models import (
    Amount,
    CreateOrder,
    ListOrder,
    Order,
    OrderStatus,
    PaymentStatus,
    UpdateAmountPaid,
    UpdateDeliveryPhotoId,
    UpdateOrderStatus,
    UpdatePaymentStatus,
    UpdatePickupPhotoId,
    UpdateRatings,
)
from app.orders.repository import OrderRepository
from app.products.service import ProductService


class OrderService:
    def __init__(self, repository: OrderRepository):
        self.repository = repository

    async def create_order(self, order_data: CreateOrder) -> Order:
        """Create a new order with business validation."""
        # Repository handles date validation
        if order_data.rent_start_date >= order_data.rent_end_date:
            raise InvalidRentDates()
        if (
            order_data.delivery_date > order_data.rent_start_date
            or order_data.pickup_date < order_data.rent_end_date
        ):
            raise InvalidDeliveryDates()
        product = await ProductService(self.repository.connection).get_product(
            order_data.product_id
        )
        orders = await self.repository.get_by_product_id(order_data.product_id)
        count = product.available_quantity
        for order in orders.orders:
            if order.order_status == OrderStatus.CONFIRMED and (
                order.rent_start_date - timedelta(days=1) <= order_data.rent_start_date
                and order.rent_end_date >= order_data.rent_end_date - timedelta(days=1)
            ):
                count -= order.quantity
            if (
                order.order_status != OrderStatus.PICKED
                or order.order_status != OrderStatus.CANCELLED
                or order.order_status != OrderStatus.DRAFT
            ) and (
                order.rent_end_date + timedelta(days=1)
            ) <= order_data.rent_start_date:
                count += order.quantity
        if count < order_data.quantity:
            raise InsufficientStock()
        item_total = order_data.quantity * product.price[order_data.rate]
        p_c = item_total * 0.05 if item_total > 1000 else item_total * 0.08
        s_t = item_total + p_c
        tax = s_t * 2.5 / 100
        amt = Amount(
            item_total=item_total,
            platform_charge=p_c,
            subtotal=s_t,
            tax=tax,
            total=s_t + tax,
        )
        # TODO: add delivery records.
        res = await self.repository.create(order_data, amt)
        if order_data.order_status == OrderStatus.CONFIRMED:
            await self.assign_order_to_delivery_partner(res)
        return res

    async def get_orders(self, limit: int = 100, offset: int = 0) -> ListOrder:
        """Get all orders with pagination."""
        return await self.repository.list(limit=limit, offset=offset)

    async def get_order(self, order_id: UUID) -> Order:
        """Get an order by ID."""
        return await self.repository.get_by_id(order_id)

    async def get_orders_by_user(
        self, user_id: UUID, limit: int = 100, offset: int = 0
    ) -> ListOrder:
        """Get orders for a specific user."""
        return await self.repository.get_by_user_id(user_id, limit=limit, offset=offset)

    async def get_orders_by_product(
        self, product_id: UUID, limit: int = 100, offset: int = 0
    ) -> ListOrder:
        """Get orders for a specific product."""
        return await self.repository.get_by_product_id(
            product_id, limit=limit, offset=offset
        )

    async def get_orders_by_status(
        self, status: OrderStatus, limit: int = 100, offset: int = 0
    ) -> ListOrder:
        """Get orders by status."""
        return await self.repository.get_by_status(status, limit=limit, offset=offset)

    async def update_order_status(
        self, order_id: UUID, update_data: UpdateOrderStatus
    ) -> Order:
        """Update order status with business logic validation."""
        current_order = await self.repository.get_by_id(order_id)

        # Validate status transition
        if not self._is_valid_status_transition(
            current_order.order_status, update_data.order_status
        ):
            raise InvalidOrderStatus(
                detail=f"Cannot transition from {current_order.order_status} to {update_data.order_status}",
                context={
                    "current_status": current_order.order_status,
                    "requested_status": update_data.order_status,
                },
            )
        if update_data.order_status == OrderStatus.CONFIRMED:
            await self.assign_order_to_delivery_partner(current_order)
        if update_data.order_status == OrderStatus.SHIPPED:
            await ProductService(connection=self.repository.connection).confirm_rental(
                current_order.product_id, current_order.quantity
            )
        if update_data.order_status == OrderStatus.PICKED:
            await ProductService(connection=self.repository.connection).return_rental(
                current_order.product_id, current_order.quantity
            )
        return await self.repository.update_order_status(order_id, update_data)

    async def update_payment_status(
        self, order_id: UUID, update_data: UpdatePaymentStatus
    ) -> Order:
        """Update payment status with validation."""
        current_order = await self.repository.get_by_id(order_id)

        # Validate payment status transition
        if not self._is_valid_payment_transition(
            current_order.payment_status, update_data.payment_status
        ):
            raise InvalidPaymentStatus(
                detail=f"Cannot transition from {current_order.payment_status} to {update_data.payment_status}",
                context={
                    "current_status": current_order.payment_status,
                    "requested_status": update_data.payment_status,
                },
            )

        return await self.repository.update_payment_status(order_id, update_data)

    async def update_amount_paid(
        self, order_id: UUID, update_data: UpdateAmountPaid
    ) -> Order:
        """Update amount paid with validation."""
        current_order = await self.repository.get_by_id(order_id)

        # Validate payment amount
        if update_data.amount_paid > current_order.amount.total:
            raise InsufficientPayment(
                detail="Payment amount cannot exceed order total",
                context={
                    "order_total": current_order.amount.total,
                    "payment_amount": update_data.amount_paid,
                },
            )

        # Update payment status based on amount paid
        updated_order = await self.repository.update_amount_paid(order_id, update_data)

        # Auto-update payment status
        new_payment_status = self._calculate_payment_status(
            updated_order.amount_paid, updated_order.amount.total
        )

        if new_payment_status != updated_order.payment_status:
            payment_update = UpdatePaymentStatus(payment_status=new_payment_status)
            updated_order = await self.repository.update_payment_status(
                order_id, payment_update
            )

        return updated_order

    async def pickup_complete(self, order_id: UUID):
        """Mark an order as picked up."""
        current_order = await self.repository.get_by_id(order_id)

        # Only allow pickup for shipped orders
        if current_order.order_status != OrderStatus.DELIVERED:
            raise InvalidOrderStatus(
                detail="Order must be in SHIPPED status to mark as picked up",
                context={"current_status": current_order.order_status},
            )

        update_data = UpdateOrderStatus(order_status=OrderStatus.PICKED)
        if current_order.amount_due > 0:
            raise InsufficientPayment(
                detail="Cannot mark as picked up with outstanding payment"
            )
        await ProductService(self.repository.connection).return_rental(
            current_order.product_id, current_order.quantity
        )
        return await self.repository.update_order_status(order_id, update_data)

    async def update_delivery_photos(
        self, order_id: UUID, update_data: UpdateDeliveryPhotoId
    ) -> Order:
        """Update delivery photo IDs."""
        return await self.repository.update_delivery_photo_id(order_id, update_data)

    async def update_pickup_photos(
        self, order_id: UUID, update_data: UpdatePickupPhotoId
    ) -> Order:
        """Update pickup photo IDs."""
        return await self.repository.update_pickup_photo_id(order_id, update_data)

    async def update_ratings(self, order_id: UUID, update_data: UpdateRatings) -> Order:
        """Update order ratings (only allowed for completed orders)."""
        current_order = await self.repository.get_by_id(order_id)

        # Only allow ratings for picked up orders
        if current_order.order_status != OrderStatus.PICKED:
            raise InvalidOrderStatus(
                detail="Ratings can only be provided for completed (picked up) orders",
                context={"current_status": current_order.order_status},
            )

        return await self.repository.update_ratings(order_id, update_data)

    async def cancel_order(self, order_id: UUID) -> Order:
        """Cancel an order if allowed."""
        current_order = await self.repository.get_by_id(order_id)

        # Check if order can be cancelled
        if not self._can_cancel_order(current_order.order_status):
            raise OrderNotCancellable(
                detail=f"Order with status {current_order.order_status} cannot be cancelled",
                context={"current_status": current_order.order_status},
            )

        cancel_update = UpdateOrderStatus(order_status=OrderStatus.CANCELLED)
        return await self.repository.update_order_status(order_id, cancel_update)

    async def delete_order(self, order_id: UUID) -> None:
        """Delete an order (hard delete - use with caution)."""
        await self.repository.delete(order_id)

    def _is_valid_status_transition(
        self, current_status: OrderStatus, new_status: OrderStatus
    ) -> bool:
        """Validate if status transition is allowed."""
        valid_transitions = {
            OrderStatus.DRAFT: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
            OrderStatus.CONFIRMED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            OrderStatus.SHIPPED: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
            OrderStatus.DELIVERED: [OrderStatus.PICKED],
            OrderStatus.PICKED: [],  # Terminal state
            OrderStatus.CANCELLED: [],  # Terminal state
        }

        return new_status in valid_transitions.get(current_status, [])

    def _is_valid_payment_transition(
        self, current_status: PaymentStatus, new_status: PaymentStatus
    ) -> bool:
        """Validate if payment status transition is allowed."""
        valid_transitions = {
            PaymentStatus.NOT_APPLICABLE: [PaymentStatus.PARTIAL, PaymentStatus.FULL],
            PaymentStatus.PARTIAL: [PaymentStatus.FULL, PaymentStatus.REFUNDED],
            PaymentStatus.FULL: [PaymentStatus.REFUNDED],
            PaymentStatus.REFUNDED: [],  # Terminal state
        }

        return new_status in valid_transitions.get(current_status, [])

    def _can_cancel_order(self, current_status: OrderStatus) -> bool:
        """Check if order can be cancelled based on current status."""
        cancellable_statuses = [
            OrderStatus.DRAFT,
            OrderStatus.CONFIRMED,
            OrderStatus.SHIPPED,
        ]
        return current_status in cancellable_statuses

    def _calculate_payment_status(
        self, amount_paid: float, total_amount: float
    ) -> PaymentStatus:
        """Calculate payment status based on amount paid."""
        if amount_paid == 0:
            return PaymentStatus.NOT_APPLICABLE
        elif amount_paid < total_amount:
            return PaymentStatus.PARTIAL
        else:
            return PaymentStatus.FULL

    async def get_order_by_shop_owner(self, shop_owner: UUID) -> ListOrder:
        """Get orders by shop owner with pagination"""
        return await self.repository.get_order_by_shop_owner(shop_owner)

    async def assign_order_to_delivery_partner(self, order_data):
        partners = await DeliveryPartnerService(
            DeliveryPartnerRepository(self.repository.connection)
        ).get_delivery_partners()
        drop_partner_id = None
        pickup_partner_id = None
        for partner in partners.delivery_partners:
            if partner.address.pincode == order_data.delivery_location.pincode:
                drop_partner_id = partner.id
            if partner.address.pincode == order_data.pickup_location.pincode:
                pickup_partner_id = partner.id
        if drop_partner_id is None or pickup_partner_id is None:
            raise DeliveryServiceNotAvailable()
        repo = DeliveryService(DeliveryRepository(self.repository.connection))
        await repo.create_delivery(
            CreateDelivery(
                delivery_partner_id=drop_partner_id,
                order_id=order_data.id,
                delivery_type=DeliveryType.DROP,
            )
        )
        await repo.create_delivery(
            CreateDelivery(
                delivery_partner_id=pickup_partner_id,
                order_id=order_data.id,
                delivery_type=DeliveryType.PICKUP,
            )
        )
