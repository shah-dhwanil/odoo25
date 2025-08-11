# List of dependencies (migration that must be applied before this one)
dependencies = ["categories.202508110640_initial", "shop_owner.202508110618_initial"]

# SQL to apply the migration
apply = [
    """--sql
    CREATE TYPE RentalUnit AS ENUM (
        'PER_HOUR',
        'PER_DAY',
        'PER_WEEK',
        'PER_MONTH',
        'PER_YEAR'
    );
    """,
    """--sql
    CREATE TABLE IF NOT EXISTS products(
        id uuid,
        name VARCHAR(128) NOT NULL,
        description TEXT,
        category_id uuid NOT NULL,
        owner_id uuid NOT NULL,
        rental_units RentalUnit[] NOT NULL,
        price JSON NOT NULL,
        security_deposit NUMERIC(10, 2) NOT NULL,
        defect_charges NUMERIC(10, 2) NOT NULL,
        care_instruction TEXT,
        total_quantity INTEGER DEFAULT 1 NOT NULL,
        available_quantity INTEGER DEFAULT 1 NOT NULL,
        reserved_quantity INTEGER DEFAULT 0 NOT NULL,
        rented_quantity INTEGER DEFAULT 0 NOT NULL,
        images_id uuid[] NOT NULL,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        CONSTRAINT pk_products PRIMARY KEY(id),
        CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES categories(id),
        CONSTRAINT fk_products_owners FOREIGN KEY (owner_id) REFERENCES shop_owner(id)
    );
    """,
    """--sql
    CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
    """,
    """--sql
    CREATE UNIQUE INDEX active_products ON products(id,is_deleted) WHERE NOT is_deleted;
    """,
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP INDEX IF EXISTS active_products;
    """,
    """--sql
    DROP INDEX IF EXISTS idx_products_name;
    """,
    """--sql
    DROP TABLE IF EXISTS products;
    """,
    """--sql
    DROP TYPE IF EXISTS RentalUnit;
    """,
]
