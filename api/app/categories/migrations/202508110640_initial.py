# List of dependencies (migration that must be applied before this one)
dependencies = []

# SQL to apply the migration
apply = [
    """--sql
    CREATE TABLE IF NOT EXISTS categories(
        id uuid,
        name VARCHAR(128) NOT NULL,
        description TEXT,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        CONSTRAINT pk_categories PRIMARY KEY(id)
    );
    """
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP TABLE IF EXISTS categories;
    """
]
