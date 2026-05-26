DROP TABLE IF EXISTS posts;

CREATE TABLE IF NOT EXISTS snapshots (
    id            SERIAL PRIMARY KEY,
    content       TEXT NOT NULL DEFAULT '',
    version_index SERIAL NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    content_hash  VARCHAR(64),
    parent_id     INTEGER REFERENCES snapshots(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_snapshots_created_at ON snapshots (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_version_index ON snapshots (version_index DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_parent_id ON snapshots (parent_id);
