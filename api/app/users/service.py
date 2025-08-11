from typing import List, Optional
from uuid import UUID

import asyncpg
from structlog import get_logger

from app.base.schemas import Address
from app.customers.models import Addresses, CreateCustomer
from app.customers.service import CustomerService
from app.delivery_partner.models import CreateDeliveryPartner
from app.delivery_partner.repository import DeliveryPartnerRepository
from app.delivery_partner.service import DeliveryPartnerService
from app.shop_owner.models import BankDetails, CreateShopOwner
from app.shop_owner.repository import ShopOwnerRepository
from app.shop_owner.service import ShopOwnerService
from app.utils.argon2 import hash_password, verify_password
from app.utils.paseto import generate_token

from .exceptions import (
    EmailAlreadyExistsException,
    MobileNumberAlreadyExistsException,
    UserNotFoundException,
)
from .models import (
    UserAuthResponse,
    UserCreate,
    UserListResponse,
    UserLogin,
    UserPasswordUpdate,
    UserPayload,
    UserResponse,
    UserType,
)
from .repository import UserRepository

logger = get_logger()


class UserService:
    def __init__(self, connection: asyncpg.Connection):
        self.repository = UserRepository(connection)

    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """Create a new user with hashed password"""
        try:
            # Hash the password before storing
            hashed_password = hash_password(user_data.password)

            # Create a new UserCreate object with hashed password
            user_with_hashed_password = UserCreate(
                name=user_data.name,
                email_id=user_data.email_id,
                mobile_no=user_data.mobile_no,
                user_type=user_data.user_type,
                password=hashed_password,
            )

            # Create user in database
            user_in_db = await self.repository.create_user(user_with_hashed_password)
            if user_in_db.user_type == UserType.CUSTOMER:
                await CustomerService(
                    connection=self.repository.connection
                ).create_customer(
                    CreateCustomer(
                        id=user_in_db.id,
                        name=user_with_hashed_password.name,
                        address=Addresses(
                            address={
                                "temp": Address(
                                    street="",
                                    city="",
                                    state="",
                                    country="",
                                    pincode="396001",
                                )
                            }
                        ),
                    )
                )
            elif user_in_db.user_type == UserType.DELIVERY_PARTNER:
                await DeliveryPartnerService(
                    DeliveryPartnerRepository(self.repository.connection)
                ).create_delivery_partner(
                    CreateDeliveryPartner(
                        id=user_in_db.id,
                        name=user_with_hashed_password.name,
                        address=Address(
                            street="", city="", state="", country="", pincode="396001"
                        ),
                    )
                )
            elif user_in_db.user_type == UserType.SHOP_OWNER:
                await ShopOwnerService(
                    ShopOwnerRepository(self.repository.connection)
                ).create_shop_owner(
                    CreateShopOwner(
                        id=user_in_db.id,
                        name=user_with_hashed_password.name,
                        owner_name="",
                        gst_no="24AAAAA0000H1Z0",
                        address=Address(
                            street="", city="", state="", country="", pincode="396001"
                        ),
                        bank_details=BankDetails(
                            account_number="", ifsc_code="", bank_name="", branch=""
                        ),
                    )
                )
            # Return public response (without password)
            return UserResponse(
                id=user_in_db.id,
                email_id=user_in_db.email_id,
                mobile_no=user_in_db.mobile_no,
                user_type=user_in_db.user_type,
                is_deleted=user_in_db.is_deleted,
                created_at=user_in_db.created_at,
            )

        except (EmailAlreadyExistsException, MobileNumberAlreadyExistsException):
            # Re-raise these specific exceptions
            raise
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            raise

    async def get_user_by_id(
        self, user_id: UUID, include_deleted: bool = False
    ) -> UserResponse:
        """Get a user by ID"""
        user = await self.repository.get_user_by_id(user_id, include_deleted)

        if not user:
            raise UserNotFoundException(user_id=user_id)

        return UserResponse(
            id=user.id,
            email_id=user.email_id,
            mobile_no=user.mobile_no,
            user_type=user.user_type,
            is_deleted=user.is_deleted,
            created_at=user.created_at,
        )

    async def get_user_by_email(
        self, email: str, include_deleted: bool = False
    ) -> UserResponse:
        """Get a user by email"""
        user = await self.repository.get_user_by_email(email, include_deleted)

        if not user:
            raise UserNotFoundException(email=email)

        return UserResponse(
            id=user.id,
            email_id=user.email_id,
            mobile_no=user.mobile_no,
            user_type=user.user_type,
            is_deleted=user.is_deleted,
            created_at=user.created_at,
        )

    async def get_user_by_mobile(
        self, mobile_no: str, include_deleted: bool = False
    ) -> UserResponse:
        """Get a user by mobile number"""
        user = await self.repository.get_user_by_mobile(mobile_no, include_deleted)

        if not user:
            raise UserNotFoundException()

        return UserResponse(
            id=user.id,
            email_id=user.email_id,
            mobile_no=user.mobile_no,
            user_type=user.user_type,
            is_deleted=user.is_deleted,
            created_at=user.created_at,
        )

    async def authenticate_user(self, login_data: UserLogin) -> UserResponse:
        """Authenticate user with email and password"""
        try:
            # Get user by email (including password for verification)
            user = await self.repository.get_user_by_email(login_data.email_id)

            if not user:
                raise UserNotFoundException(email=login_data.email_id)

            # Verify password
            if not verify_password(user.password, login_data.password):
                raise UserNotFoundException(email=login_data.email_id)
            user_payload = UserPayload(id=user.id, role=user.user_type)
            token = generate_token(user_payload.model_dump_json())
            # Return user response (without password)
            return UserAuthResponse(
                access_token=token, role=user.user_type, user_id=user.id
            )

        except UserNotFoundException:
            # Re-raise as the same exception for security (don't reveal if email exists)
            raise UserNotFoundException(email=login_data.email_id)
        except Exception as e:
            logger.error(f"Error authenticating user: {e}")
            raise

    async def update_password(
        self, user_id: UUID, password_data: UserPasswordUpdate
    ) -> bool:
        """Update user password with current password verification"""
        try:
            # Get user with current password
            user = await self.repository.get_user_by_id(user_id)

            if not user:
                raise UserNotFoundException(user_id=user_id)

            # Verify current password
            if not verify_password(user.password, password_data.current_password):
                return False

            # Hash new password
            new_hashed_password = hash_password(password_data.new_password)

            # Update password in database
            await self.repository.update_user(
                user_id=user_id, password=new_hashed_password
            )

            return True

        except UserNotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error updating password for user {user_id}: {e}")
            raise

    async def delete_user(self, user_id: UUID) -> bool:
        """Delete a user"""
        try:
            # Check if user exists first
            if not await self.repository.user_exists(user_id):
                raise UserNotFoundException(user_id=user_id)

            return await self.repository.delete_user(user_id)

        except UserNotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error soft deleting user {user_id}: {e}")
            raise

    async def list_users(
        self,
        page: int = 1,
        page_size: int = 10,
        user_type: Optional[UserType] = None,
        include_deleted: bool = False,
        search: Optional[str] = None,
    ) -> UserListResponse:
        """List users with pagination and filtering"""
        try:
            # Validate pagination parameters
            if page < 1:
                page = 1
            if page_size < 1 or page_size > 100:
                page_size = 10

            users, total = await self.repository.list_users(
                page=page,
                page_size=page_size,
                user_type=user_type,
                include_deleted=include_deleted,
                search=search,
            )

            return UserListResponse(
                users=users, total=total, page=page, page_size=page_size
            )

        except Exception as e:
            logger.error(f"Error listing users: {e}")
            raise

    async def get_users_by_type(
        self, user_type: UserType, include_deleted: bool = False
    ) -> List[UserResponse]:
        """Get all users of a specific type"""
        try:
            return await self.repository.get_users_by_type(user_type, include_deleted)
        except Exception as e:
            logger.error(f"Error getting users by type {user_type}: {e}")
            raise

    async def user_exists(self, user_id: UUID, include_deleted: bool = False) -> bool:
        """Check if user exists"""
        try:
            return await self.repository.user_exists(user_id, include_deleted)
        except Exception as e:
            logger.error(f"Error checking user existence {user_id}: {e}")
            raise

    async def create_admin_user(self, user_data: UserCreate) -> UserResponse:
        """Create an admin user (special method with additional validation)"""
        # Ensure user type is admin
        admin_user_data = UserCreate(
            email_id=user_data.email_id,
            mobile_no=user_data.mobile_no,
            user_type=UserType.ADMIN,
            password=user_data.password,
        )
        return await self.create_user(admin_user_data)
