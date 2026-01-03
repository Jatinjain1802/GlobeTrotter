CREATE DATABASE IF NOT EXISTS globetrotter_db;
USE globetrotter_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT,
  cover_photo_url TEXT,
  budget_est DECIMAL(10, 2) DEFAULT 0.00,
  visibility ENUM('private', 'public') DEFAULT 'private',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cities Table (Pre-seeded)
CREATE TABLE IF NOT EXISTS cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  cost_index ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
  image_url VARCHAR(500)
);

-- Activities Table (Pre-seeded)
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  type VARCHAR(100),
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- Trip Stops Table (Linking Trips to Cities)
CREATE TABLE IF NOT EXISTS trip_stops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  city_id INT NOT NULL,
  arrival_date DATE,
  departure_date DATE,
  order_index INT NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- Trip Activities Table (Linking Stops/Days to Activities)
CREATE TABLE IF NOT EXISTS trip_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_stop_id INT NOT NULL,
  activity_id INT NOT NULL,
  day_number INT DEFAULT 1, -- Day number relative to the stop
  FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  date DATE,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- SEED DATA
INSERT IGNORE INTO cities (id, name, country, cost_index) VALUES 
(1, 'Paris', 'France', 'HIGH'),
(2, 'London', 'UK', 'HIGH'),
(3, 'Bangkok', 'Thailand', 'LOW'),
(4, 'Tokyo', 'Japan', 'HIGH'),
(5, 'Prague', 'Czech Republic', 'MEDIUM'),
(6, 'Bali', 'Indonesia', 'LOW'),
(7, 'New York', 'USA', 'HIGH'),
(8, 'Rome', 'Italy', 'MEDIUM'),
(9, 'Istanbul', 'Turkey', 'MEDIUM'),
(10, 'Dubai', 'UAE', 'HIGH');

INSERT IGNORE INTO activities (city_id, name, cost, type) VALUES
(1, 'Eiffel Tower Tour', 50.00, 'Sightseeing'),
(1, 'Louvre Museum', 25.00, 'Museum'),
(2, 'London Eye', 40.00, 'Sightseeing'),
(2, 'British Museum', 0.00, 'Museum'),
(3, 'Grand Palace', 15.00, 'Sightseeing'),
(3, 'Street Food Tour', 20.00, 'Food'),
(4, 'TeamLabs Planet', 35.00, 'Museum'),
(4, 'Shibuya Crossing', 0.00, 'Sightseeing'),
(5, 'Prague Castle', 18.00, 'Sightseeing'),
(5, 'Charles Bridge', 0.00, 'Sightseeing'),
(6, 'Uluwatu Temple', 10.00, 'Sightseeing'),
(6, 'Scuba Diving', 80.00, 'Adventure'),
(7, 'Statue of Liberty', 30.00, 'Sightseeing'),
(7, 'Broadway Show', 150.00, 'Entertainment'),
(8, 'Colosseum', 25.00, 'Sightseeing'),
(8, 'Vatican Museums', 30.00, 'Museum'),
(9, 'Hagia Sophia', 0.00, 'Sightseeing'),
(9, 'Bosphorus Cruise', 15.00, 'Sightseeing'),
(10, 'Burj Khalifa', 60.00, 'Sightseeing'),
(10, 'Desert Safari', 50.00, 'Adventure');
