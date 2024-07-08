CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR UNIQUE,
	first_name VARCHAR,
	last_name VARCHAR,
	password VARCHAR,
	profile_pic_file_id INT REFERENCES files(id),
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	genre VARCHAR,
	title VARCHAR,
	tagline VARCHAR,
	description VARCHAR,
	cover_img_file_id INT REFERENCES files(id),
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);

CREATE TABLE chapters (
	id SERIAL PRIMARY KEY,
	title VARCHAR,
	content TEXT,
	num_of_words INT,
	status VARCHAR,
	book_id INT REFERENCES books(id),
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);


CREATE TABLE files (
	id SERIAL PRIMARY KEY,
	base_64 TEXT,
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);


CREATE TABLE drafts (
	id SERIAL PRIMARY KEY,
	author_id INT REFERENCES users(id),
	chapter_id INT REFERENCES chapters(id),
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);

CREATE TABLE readlists (
	id SERIAL PRIMARY KEY,
	title VARCHAR,
	description VARCHAR,
	user_id INT REFERENCES users(id),
	book_id INT REFERENCES books(id),
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	title VARCHAR,
	description VARCHAR,
	user_id INT REFERENCES users(id),
	book_id INT REFERENCES books(id),
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);

CREATE TABLE likes (
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id),
	book_id INT REFERENCES books(id),
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);