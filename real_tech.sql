CREATE DATABASE real_tech_db;

USE real_tech_db;

CREATE TABLE business_licenses (
	index_label INT AUTO_INCREMENT NOT NULL, 
    legal_name VARCHAR(100),
    doing_business_as_name VARCHAR(400),
    zip_code VARCHAR(400),
    license_description Integer,
    business_activity Integer,
    application_type VARCHAR(400),
    license_start_date VARCHAR(20),
    latitude Integer,
    longitude Integer,
    start_year Integer,
    PRIMARY KEY (index_label)
)