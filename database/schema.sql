-- University Lost and Found Database Schema

CREATE DATABASE IF NOT EXISTS university_lost_found;
USE university_lost_found;

-- Items table to store lost and found items
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('lost', 'found') NOT NULL,
    location VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    date_reported DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(500),
    is_claimed BOOLEAN DEFAULT FALSE,
    claimed_date DATETIME NULL,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_date (date_reported)
);

-- Sample data for demonstration
INSERT INTO items (item_name, category, description, status, location, contact_name, contact_email, contact_phone) VALUES
('Blue Backpack', 'Bags', 'Blue Jansport backpack with laptop inside', 'found', 'Library 2nd Floor', 'John Doe', 'john@university.edu', '555-0101'),
('iPhone 13', 'Electronics', 'Black iPhone 13 with cracked screen', 'lost', 'Cafeteria', 'Sarah Smith', 'sarah@university.edu', '555-0102'),
('Red Water Bottle', 'Personal Items', 'Stainless steel red water bottle', 'found', 'Gym', 'Mike Johnson', 'mike@university.edu', '555-0103');
