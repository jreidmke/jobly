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
VALUES('apple', 'Apple', 250, 'We make good computers', 'apple.com'),
('pizza', 'Pizza Place.', 10000, 'We make good pizza', 'pizza.org'),
('candy', 'Candy Co.', 600, 'We make good candy', 'candy.com');

INSERT INTO jobs(title, salary, equity, company_handle)
VALUES('cleaner', 49.15, .5, 'apple'),
('builder guy', 15.83, .2, 'pizza'),
('machine guy', 20.59, .3, 'candy');

INSERT INTO users
VALUES('jreid', '$2a$12$tjGXX/ncfKUIbz88ucgMouIhhL8SaQb0/DfnI1V0jingQonofTSha', 'James', 'Reid', 'jreidmke@gamil.com', 'blah', TRUE),
('mariaa', '$2a$12$tjGXX/ncfKUIbz88ucgMouIhhL8SaQb0/DfnI1V0jingQonofTSha', 'Maria', 'Aldapa', 'mariaa@gmail.com', 'blah', FALSE);

SELECT * FROM companies;
SELECT * FROM jobs;
SELECT * FROM users;

\dt