# List of dependencies (migration that must be applied before this one)
dependencies = ["users.202508110605_initial"]

# SQL to apply the migration
apply = [
    """--sql
    CREATE TABLE IF NOT EXISTS shop_owner(
        id uuid,
        name VARCHAR(128) NOT NULL,
        owner_name VARCHAR(64) NOT NULL,
        gst_no CHAR(15) NOT NULL,
        address JSON NOT NULL,
        bank_details JSON NOT NULL,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        CONSTRAINT pk_shop_owner PRIMARY KEY(id),
        CONSTRAINT fk_shop_owner_users FOREIGN KEY (id,is_deleted) REFERENCES users(id,is_deleted) ON UPDATE CASCADE
    );
    """,
    """--sql
    CREATE UNIQUE INDEX uniq_shop_owner_gst_no ON shop_owner(gst_no,is_deleted) WHERE NOT is_deleted;
    """,
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP CONSTRAINT uniq_shop_owner_gst_no;
    """,
    """--sql
    DROP TABLE IF EXISTS shop_owner;
    """,
]
