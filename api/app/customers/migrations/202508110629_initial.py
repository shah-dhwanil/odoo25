# List of dependencies (migration that must be applied before this one)
dependencies = ["users.202508110605_initial"]

# SQL to apply the migration
apply = [
    """--sql
    CREATE TABLE IF NOT EXISTS customers(
        id uuid,
        name VARCHAR(128) NOT NULL,
        address JSON NOT NULL,
        loyalty_points INTEGER NOT NULL DEFAULT 10,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        CONSTRAINT pk_customers PRIMARY KEY(id),
        CONSTRAINT fk_customers_users FOREIGN KEY (id,is_deleted) REFERENCES users(id,is_deleted) ON UPDATE CASCADE
    );
    """
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP TABLE IF EXISTS customers;
    """
]
