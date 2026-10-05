CREATE DATABASE IF NOT EXISTS web_project;
USE web_project;
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- After testing, run this and screenshot the result:
-- SELECT * FROM contacts;
