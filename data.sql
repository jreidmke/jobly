\c jobly

DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE companies(
    handle TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    num_employees INT,
    description TEXT,
    logo_url TEXT
);

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT NOT NULL,
    equity FLOAT NOT NULL CHECK(equity < 1),
    company_handle TEXT REFERENCES companies(handle) ON DELETE CASCADE,
    date_posted DATE default CURRENT_TIMESTAMP
);

CREATE TABLE users(
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    is_admin BOOLEAN NOT NULL default FALSE
);

INSERT INTO companies
VALUES('apple', 'Apple', 250, 'We make bad computers', 'google.com'),
('pizza', 'Pizza Co.', 10000, 'We make bad pizza', 'pizza.org'),
('biden', 'Biden Biz.', 600, 'We make good choices', 'biden.com');

SELECT * FROM companies;

\dt