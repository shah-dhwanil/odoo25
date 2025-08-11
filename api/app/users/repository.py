from typing import List, Optional
from uuid import UUID, uuid4

import asyncpg
from pydantic_extra_types.phone_numbers import PhoneNumber
from structlog import get_logger

from .exceptions import EmailAlreadyExistsException, MobileNumberAlreadyExistsException
from .models import UserCreate, UserInDB, UserResponse, UserType


class UserRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """Create a new user in the database"""
        query = """
            INSERT INTO users (id, email_id, mobile_no, password, user_type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email_id, mobile_no, password, user_type, is_deleted, created_at
        """

        user_id = uuid4()
        try:
            # Insert new user
            row = await self.connection.fetchrow(
                query,
                user_id,
                user_data.email_id,
                str(user_data.mobile_no),
                user_data.password,
                user_data.user_type.value,
            )
        except asyncpg.UniqueViolationError as e:
            get_logger().error(f"Unique constraint violation during update: {e}")
            if "email_id" in str(e):
                raise EmailAlreadyExistsException(user_data.email_id)
            elif "mobile_no" in str(e):
                raise MobileNumberAlreadyExistsException(user_data.mobile_no)
            raise e
        return UserInDB(
            id=row["id"],
            email_id=row["email_id"],
            mobile_no=PhoneNumber(row["mobile_no"]),
            password=row["password"],
            user_type=UserType(row["user_type"]),
            is_deleted=row["is_deleted"],
            created_at=row["created_at"],
        )

    async def get_user_by_id(
        self, user_id: UUID, include_deleted: bool = False
    ) -> Optional[UserInDB]:
        """Get a user by ID"""
        query = """
            SELECT id, email_id, mobile_no, password, user_type, is_deleted, created_at
            FROM users
            WHERE id = $1
        """

        if not include_deleted:
            query += " AND is_deleted = FALSE"

        try:
            row = await self.connection.fetchrow(query, user_id)

            if not row:
                return None

            return UserInDB(
                id=row["id"],
                email_id=row["email_id"],
                mobile_no=PhoneNumber(row["mobile_no"]),
                password=row["password"],
                user_type=UserType(row["user_type"]),
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        except Exception as e:
            get_logger().error(f"Error getting user by ID {user_id}: {e}")
            raise

    async def get_user_by_email(
        self, email: str, include_deleted: bool = False
    ) -> Optional[UserInDB]:
        """Get a user by email"""
        query = """
            SELECT id, email_id, mobile_no, password, user_type, is_deleted, created_at
            FROM users
            WHERE email_id = $1 AND is_deleted = FALSE
        """

        try:
            row = await self.connection.fetchrow(query, email)

            if not row:
                return None

            return UserInDB(
                id=row["id"],
                email_id=row["email_id"],
                mobile_no=PhoneNumber(row["mobile_no"]),
                password=row["password"],
                user_type=UserType(row["user_type"]),
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        except Exception as e:
            get_logger().error(f"Error getting user by email {email}: {e}")
            raise

    async def get_user_by_mobile(
        self, mobile_no: str, include_deleted: bool = False
    ) -> Optional[UserInDB]:
        """Get a user by mobile number"""
        query = """
            SELECT id, email_id, mobile_no, password, user_type, is_deleted, created_at
            FROM users
            WHERE mobile_no = $1
        """

        if not include_deleted:
            query += " AND is_deleted = FALSE"

        try:
            row = await self.connection.fetchrow(query, mobile_no)

            if not row:
                return None

            return UserInDB(
                id=row["id"],
                email_id=row["email_id"],
                mobile_no=PhoneNumber(row["mobile_no"]),
                password=row["password"],
                user_type=UserType(row["user_type"]),
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        except Exception as e:
            get_logger().error(f"Error getting user by mobile {mobile_no}: {e}")
            raise

    async def update_user(
        self, user_id: UUID, password: Optional[str] = None
    ) -> UserInDB:
        """Update user information"""
        # Build dynamic update query
        query = """--sql
        UPDATE users
        SET
            password = $1
        WHERE id = $2 AND is_deleted = FALSE;
        """
        print(user_id, password)
        await self.connection.execute(query, password, user_id)

    async def delete_user(self, user_id: UUID) -> bool:
        """Soft delete a user by setting is_deleted = TRUE"""
        query = """
            UPDATE users
            SET is_deleted = TRUE
            WHERE id = $1 AND is_deleted = FALSE
            RETURNING id
        """

        try:
            row = await self.connection.fetchrow(query, user_id)
            return row is not None
        except Exception as e:
            get_logger().error(f"Error soft deleting user {user_id}: {e}")
            raise

    async def list_users(
        self,
        page: int = 1,
        page_size: int = 10,
        user_type: Optional[UserType] = None,
        include_deleted: bool = False,
        search: Optional[str] = None,
    ) -> tuple[List[UserResponse], int]:
        """List users with pagination and filtering"""
        offset = (page - 1) * page_size
        where_clauses = []
        params = []
        param_count = 1

        if not include_deleted:
            where_clauses.append("is_deleted = FALSE")

        if user_type is not None:
            where_clauses.append(f"user_type = ${param_count}")
            params.append(user_type.value)
            param_count += 1

        if search:
            where_clauses.append(
                f"(email_id ILIKE ${param_count} OR mobile_no ILIKE ${param_count})"
            )
            params.append(f"%{search}%")
            param_count += 1

        where_clause = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        # Count query
        count_query = f"SELECT COUNT(*) FROM users {where_clause}"

        # Data query
        data_query = f"""
            SELECT id, email_id, mobile_no, user_type, is_deleted, created_at
            FROM users
            {where_clause}
            ORDER BY created_at DESC
            LIMIT ${param_count} OFFSET ${param_count + 1}
        """
        params.extend([page_size, offset])

        try:
            # Get total count
            total = await self.connection.fetchval(count_query, *params[:-2])

            # Get users
            rows = await self.connection.fetch(data_query, *params)

            users = [
                UserResponse(
                    id=row["id"],
                    email_id=row["email_id"],
                    mobile_no=PhoneNumber(row["mobile_no"]),
                    user_type=UserType(row["user_type"]),
                    is_deleted=row["is_deleted"],
                    created_at=row["created_at"],
                )
                for row in rows
            ]

            return users, total

        except Exception as e:
            get_logger().error(f"Error listing users: {e}")
            raise

    async def get_users_by_type(
        self, user_type: UserType, include_deleted: bool = False
    ) -> List[UserResponse]:
        """Get all users of a specific type"""
        query = """
            SELECT id, email_id, mobile_no, user_type, is_deleted, created_at
            FROM users
            WHERE user_type = $1
        """

        if not include_deleted:
            query += " AND is_deleted = FALSE"

        query += " ORDER BY created_at DESC"

        try:
            rows = await self.connection.fetch(query, user_type.value)

            return [
                UserResponse(
                    id=row["id"],
                    email_id=row["email_id"],
                    mobile_no=PhoneNumber(row["mobile_no"]),
                    user_type=UserType(row["user_type"]),
                    is_deleted=row["is_deleted"],
                    created_at=row["created_at"],
                )
                for row in rows
            ]
        except Exception as e:
            get_logger().error(f"Error getting users by type {user_type}: {e}")
            raise

    async def user_exists(self, user_id: UUID, include_deleted: bool = False) -> bool:
        """Check if user exists"""
        query = "SELECT 1 FROM users WHERE id = $1"

        if not include_deleted:
            query += " AND is_deleted = FALSE"

        try:
            result = await self.connection.fetchval(query, user_id)
            return result is not None
        except Exception as e:
            get_logger().error(f"Error checking user existence {user_id}: {e}")
            raise
