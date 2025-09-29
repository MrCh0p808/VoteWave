-- migrations/rollback/001_drop_votes.sql
-- Ticket #76: Rollback votes schema

DROP TABLE IF EXISTS votes;
