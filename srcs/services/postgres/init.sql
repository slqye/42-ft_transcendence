CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password_hash) VALUES (
    'testuser',
    'testuser@example.com',
    '$2b$12$KIXQ4ShNf8FhJ4z5x1eY.eYfQfK1pJYoU8U1h8jZUz7/1bWb9Xy5K' -- Example bcrypt hash for 'password123'
);