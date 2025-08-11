# List of dependencies (migration that must be applied before this one)
dependencies = ["products.202508110646_initial", "customers.202508110629_initial"]

# SQL to apply the migration
apply = [
    """--sql
    CREATE TYPE OrderStatus AS ENUM (
        'DRAFT',
        'CONFIRMED',
        'SHIPPED',
        'DELIVERED',
        'PICKED',
        'CANCELLED'
    );
    """,
    """--sql
    CREATE TYPE PaymentStatus AS ENUM (
        'NOT APPLICABLE',
        'PARTIAL',
        'FULL',
        'REFUNDED'
    );
    """,
    """--sql
    CREATE TABLE IF NOT EXISTS orders(
        id uuid,
        user_id uuid NOT NULL,
        product_id uuid NOT NULL,
        quantity INTEGER NOT NULL,
        rent_start_date TIMESTAMP(0) WITH TIME ZONE NOT NULL,
        rent_end_date TIMESTAMP(0) WITH TIME ZONE NOT NULL,
        delivery_location JSON NOT NULL,
        pickup_location JSON NOT NULL,
        delivery_date TIMESTAMP(0) WITH TIME ZONE NOT NULL,
        pickup_date TIMESTAMP(0) WITH TIME ZONE NOT NULL,
        amount JSON NOT NULL,
        amount_paid NUMERIC(10,2) NOT NULL,
        amount_due NUMERIC(10,2) NOT NULL,
        order_status OrderStatus NOT NULL,
        payment_status OrderStatus NOT NULL,
        delivery_photo_id UUID[] NOT NULL,
        pickup_photo_id UUID[] NOT NULL,
        ratings INTEGER,
        created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        CONSTRAINT pk_orders PRIMARY KEY(id),
        CONSTRAINT fk_orders_products FOREIGN KEY (product_id) REFERENCES products(id),
        CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """,
    """--sql
    CREATE INDEX idx_users_orders ON orders(user_id);
    """,
    """--sql
    CREATE INDEX idx_orders_product ON orders(product_id);
    """,
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP INDEX IF EXISTS idx_orders_product;
    """,
    """--sql
    DROP INDEX IF EXISTS idx_users_orders;
    """,
    """--sql
    DROP TABLE IF EXISTS orders;
    """,
    """--sql
    DROP TYPE IF EXISTS PaymentStatus;
    """,
    """--sql
    DROP TYPE IF EXISTS OrderStatus;
    """,
]
