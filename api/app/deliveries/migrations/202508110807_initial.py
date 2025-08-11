# List of dependencies (migration that must be applied before this one)
dependencies = ["orders.202508110732_initial"]

# SQL to apply the migration
apply = [
    """--sql
    CREATE TYPE DeliveryType AS ENUM (
        'PICKUP',
        'DROP'
    );
    """,
    """--sql
    CREATE TABLE IF NOT EXISTS deliveries(
        id uuid,
        order_id uuid NOT NULL,
        delivery_type DeliveryType NOT NULL,
        delivery_partner_id UUID NOT NULL,
        ratings INTEGER,
        CONSTRAINT pk_deliveries PRIMARY KEY(id),
        CONSTRAINT fk_deliveries_orders FOREIGN KEY (order_id) REFERENCES orders(id),
        CONSTRAINT fk_deliveries_partners FOREIGN KEY (delivery_partner_id) REFERENCES delivery_partners(id)
    );
    """,
    """--sql
    CREATE INDEX idx_deliveries_order ON deliveries(order_id);
    """,
    """--sql
    CREATE INDEX idx_deliveries_partner ON deliveries(delivery_partner_id);
    """,
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP INDEX IF EXISTS idx_deliveries_partner;
    """,
    """--sql
    DROP INDEX IF EXISTS idx_deliveries_order;
    """,
    """--sql
    DROP TABLE IF EXISTS deliveries;
    """,
    """--sql
    DROP TYPE IF EXISTS DeliveryType;
    """,
]
