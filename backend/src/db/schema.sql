-- AgriVision AI - Database Schema for Tomato Leaf Pathology System
-- Database: agrivision_db

CREATE DATABASE IF NOT EXISTS agrivision_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrivision_db;

-- 1. Users Table
-- Stores user credentials with bcrypt password hashes and roles
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(60) NOT NULL DEFAULT 'Field Agronomist',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Scans Table
-- Stores individual tomato leaf inspections owned by a user
CREATE TABLE IF NOT EXISTS scans (
  id VARCHAR(64) PRIMARY KEY,
  user_id INT NOT NULL,
  image_name VARCHAR(255) NOT NULL,
  image_path VARCHAR(500) NULL,
  disease_key VARCHAR(64) NOT NULL,
  disease_name VARCHAR(120) NOT NULL,
  scientific_name VARCHAR(120) NOT NULL,
  severity VARCHAR(40) NOT NULL,
  confidence FLOAT NOT NULL,
  is_healthy BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_scans_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_scans_user_created (user_id, created_at DESC),
  INDEX idx_scans_disease (disease_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
