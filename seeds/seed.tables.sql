-- psql -U wesleyjacobs -d bugout -f ./seeds/seed.bugout.sql

BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Spanish', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'sandía', 'watermelon', 2),
  (2, 1, 'comida', 'meal', 3),
  (3, 1, 'agua', 'water', 4),
  (4, 1, 'lentes', 'glasses', 5),
  (5, 1, 'cafè', 'coffee', 6),
  (6, 1, 'pollo', 'chicken', 7),
  (7, 1, 'escritorio', 'desk', 8),
  (8, 1, 'capucha', 'hoodie', 9),
  (9, 1, 'pescado', 'fish', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
