-- Up Migration
DROP TABLE guest_creations;

-- Down Migration
CREATE TABLE guest_creations (
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX guest_creations_ip_hash_created_at_idx ON guest_creations (ip_hash, created_at);
