DROP SCHEMA IF EXISTS carecycle CASCADE;
CREATE SCHEMA carecycle;
SET search_path TO carecycle, public;

CREATE TABLE UserType (
    userType_id SERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE MapArea (
    map_id SERIAL PRIMARY KEY,
    map_area_name VARCHAR(255) NOT NULL
);

CREATE TABLE Area (
    area_id SERIAL PRIMARY KEY,
    area_name VARCHAR(255) NOT NULL
);

CREATE TABLE PostalCode (
    postal_code_id SERIAL PRIMARY KEY,
    postal_code VARCHAR(10) NOT NULL,
    area_id INT REFERENCES Area(area_id)
);

CREATE TABLE Workshop (
    workshop_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE PrimaryGender (
    primary_gender_id SERIAL PRIMARY KEY,
    gender_name VARCHAR(255) NOT NULL
);

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    vegetable VARCHAR(255),
    primary_gender_id INT REFERENCES PrimaryGender(primary_gender_id),
    year_of_birth INT,
    postal_code_id INT REFERENCES PostalCode(postal_code_id),
    is_active BOOLEAN,
    userType_id INT REFERENCES UserType(userType_id),
    map_id INT REFERENCES MapArea(map_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE ClientStats (
    cs_id SERIAL PRIMARY KEY,
    year_of_birth INT,
    primary_gender_id INT REFERENCES PrimaryGender(primary_gender_id),
    map_id INT REFERENCES MapArea(map_id),
    postal_code_id INT REFERENCES PostalCode(postal_code_id),
    workshop_id INT REFERENCES Workshop(workshop_id),
    user_id INT REFERENCES Users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE GenderIdentity (
    gender_identity_id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE client_genderIdentity (
    cs_id INT,
    gender_identity_id INT,
    PRIMARY KEY (cs_id, gender_identity_id),
    FOREIGN KEY (cs_id) REFERENCES ClientStats(cs_id),
    FOREIGN KEY (gender_identity_id) REFERENCES GenderIdentity(gender_identity_id)
);

CREATE TABLE users_genderIdentity (
    user_id INT,
    gender_identity_id INT,
    PRIMARY KEY (user_id, gender_identity_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (gender_identity_id) REFERENCES GenderIdentity(gender_identity_id)
);

CREATE TABLE VolunteerAttendance (
    va_id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    user_id INT REFERENCES Users(user_id),
    workshop_id INT REFERENCES Workshop(workshop_id)
);

CREATE TABLE ClientStatsReport (
    cs_report_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE VolunteerStatsReport (
    vs_report_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE VolunteerAttendanceReport (
    va_report_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientStats_Report (
    cs_id INT,
    cs_report_id INT,
    PRIMARY KEY (cs_id, cs_report_id),
    FOREIGN KEY (cs_id) REFERENCES ClientStats(cs_id),
    FOREIGN KEY (cs_report_id) REFERENCES ClientStatsReport(cs_report_id)
);

CREATE TABLE volunteerAttendance_Report (
    va_id INT,
    va_report_id INT,
    PRIMARY KEY (va_id, va_report_id),
    FOREIGN KEY (va_id) REFERENCES VolunteerAttendance(va_id),
    FOREIGN KEY (va_report_id) REFERENCES VolunteerAttendanceReport(va_report_id)
);

CREATE TABLE User_VolunteerStatsReport (
    user_id INT,
    vs_report_id INT,
    PRIMARY KEY (user_id, vs_report_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (vs_report_id) REFERENCES VolunteerStatsReport(vs_report_id)
);
