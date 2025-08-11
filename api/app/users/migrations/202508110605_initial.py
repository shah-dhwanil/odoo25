# List of dependencies (migration that must be applied before this one)
dependencies = []

# SQL to apply the migration
apply = [
    """--sql
    CREATE TYPE UserType AS ENUM (
        'ADMIN',
        'SHOP_OWNER', 
        'DELIVERY_PARTNER',
        'CUSTOMER'
    );
    """,
    """--sql
    CREATE TABLE users(
        id uuid,
        email_id VARCHAR(64) NOT NULL,
        mobile_no VARCHAR(32) NOT NULL,
        password VARCHAR(500) NOT NULL,
        user_type UserType NOT NULL,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        CONSTRAINT pk_users PRIMARY KEY(id),
        CONSTRAINT uniq_users_is_active UNIQUE(id,is_deleted)
    );
    """,
    """--sql
    CREATE UNIQUE INDEX uniq_users_email_id ON users(email_id,is_deleted) WHERE NOT is_deleted;
    """,
    """--sql
    CREATE UNIQUE INDEX uniq_users_mobile_no ON users(mobile_no,is_deleted) WHERE NOT is_deleted;
    """,
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP INDEX uniq_users_email_id;
    """,
    """--sql
    DROP INDEX uniq_users_mobile_no;
    """,
    """--sql
    DROP TABLE users;
    """,
    """--sql
    DROP TYPE UserType;
    """,
]
