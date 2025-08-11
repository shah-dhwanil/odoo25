from uuid import UUID

from app.shop_owner.exceptions import ShopOwnerGSTAlreadyExists, ShopOwnerNotFound
from app.shop_owner.models import (
    CreateShopOwner,
    ListShopOwner,
    ShopOwner,
    UpdateShopOwner,
)
from app.shop_owner.repository import ShopOwnerRepository


class ShopOwnerService:
    def __init__(self, repository: ShopOwnerRepository):
        self.repository = repository

    async def create_shop_owner(self, shop_owner_data: CreateShopOwner) -> ShopOwner:
        """
        Create a new shop owner after validating business rules.
        """
        return await self.repository.create(shop_owner_data)

    async def get_shop_owner_by_id(self, shop_owner_id: UUID) -> ShopOwner:
        """
        Retrieve a shop owner by ID.
        """
        return await self.repository.get_by_id(shop_owner_id)

    async def get_shop_owner_by_gst(self, gst_no: str) -> ShopOwner:
        """
        Retrieve a shop owner by GST number.
        """
        return await self.repository.get_by_gst_no(gst_no)

    async def list_shop_owners(self) -> ListShopOwner:
        """
        Retrieve all active shop owners.
        """
        shop_owners = await self.repository.list()
        return ListShopOwner(shop_owners=shop_owners)

    async def update_shop_owner(
        self, shop_owner_id: UUID, update_data: UpdateShopOwner
    ) -> ShopOwner:
        """
        Update an existing shop owner after validating business rules.
        """
        # First check if the shop owner exists
        existing_shop_owner = await self.repository.get_by_id(shop_owner_id)

        # Check if GST number is being changed and if it conflicts with another shop owner
        if update_data.gst_no != existing_shop_owner.gst_no:
            try:
                existing_gst_owner = await self.repository.get_by_gst_no(
                    update_data.gst_no
                )
                if existing_gst_owner.id != shop_owner_id:
                    raise ShopOwnerGSTAlreadyExists(
                        detail="Another shop owner with this GST number already exists",
                        context={"gst_no": update_data.gst_no},
                    )
            except ShopOwnerNotFound:
                # GST number is unique, proceed with update
                pass

        return await self.repository.update(shop_owner_id, update_data)

    async def delete_shop_owner(self, shop_owner_id: UUID) -> None:
        """
        Soft delete a shop owner.
        """
        # Check if shop owner exists before deletion
        await self.repository.get_by_id(shop_owner_id)
        await self.repository.delete(shop_owner_id)

    async def shop_owner_exists(self, shop_owner_id: UUID) -> bool:
        """
        Check if a shop owner exists by ID.
        """
        try:
            await self.repository.get_by_id(shop_owner_id)
            return True
        except ShopOwnerNotFound:
            return False

    async def gst_number_exists(self, gst_no: str, exclude_id: UUID = None) -> bool:
        """
        Check if a GST number exists, optionally excluding a specific shop owner ID.
        """
        try:
            existing_shop_owner = await self.repository.get_by_gst_no(gst_no)
            if exclude_id and existing_shop_owner.id == exclude_id:
                return False
            return True
        except ShopOwnerNotFound:
            return False
