# List of dependencies (migration that must be applied before this one)
dependencies = ["users.202508110605_initial"]

# SQL to apply the migration
apply = [
    """--sql
    CREATE TABLE IF NOT EXISTS delivery_partners(
        id uuid,
        name VARCHAR(128) NOT NULL,
        address JSON NOT NULL,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        CONSTRAINT pk_delivery_partners PRIMARY KEY(id),
        CONSTRAINT fk_delivery_partners_users FOREIGN KEY (id,is_deleted) REFERENCES users(id,is_deleted) ON UPDATE CASCADE
    );
    """
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP TABLE IF EXISTS delivery_partners;
    """
]
