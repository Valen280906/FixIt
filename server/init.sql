CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'client', -- 'client' or 'technician'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES users(id),
  service VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'assigned', 'in_progress', 'completed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES requests(id),
  technician_id INTEGER REFERENCES users(id),
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
