# Project Name: Spaced repetition

## About project

Spaced Repetition is an application that users can learn 10 basic Spanish words and can take a practice word anytime when they are ready for it.
Users able to check their answer is correct or incorrect directly on the learning page.
Also, Spaced Repetition will display how many times they got correct or incorrect answers for each word and total score on the dashboard page.
I hope many users use our Spaced Repetition to improve their Spanish word knowledge skills.

- Live Page: [Live](https://spacedrepetition.now.sh/)
- Heroku: [Heroku](https://polar-coast-57735.herokuapp.com/)
- API Server Code: [Server](https://github.com/thinkful-ei-heron/spaced-repetition-api-heesu-wesley-zayar)
- Client Code:[Client](https://github.com/thinkful-ei-heron/spaced-repetition-client-heesu-wesley-zayar)

-----------------------

## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`

-----------------------

Copyright © Wesley Jacobs & Heesu Kang & Zayar Khin
