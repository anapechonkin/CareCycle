INSERT INTO UserType (role) VALUES ('Volunteer'), ('Admin'), ('Ca/Employee');

INSERT INTO MapArea (map_area_name) VALUES ('RegionOne'), ('RegionTwo'), ('RegionThree'), ('RegionFour'), ('RegionFive'), ('RegionSix'), ('RegionSeven'), ('RegionEight'), ('RegionNine');

INSERT INTO Area (area_name) VALUES ('Parc-X'), ('Villeray'), ('Rest of Montreal'), ('Outside Montreal');

INSERT INTO PostalCode (postal_code, area_id) VALUES
('H2A1A2', 1), -- Assuming 1 is the ID for Parc-X
('H1B2B3', 2), -- Assuming 2 is the ID for Villeray
('H3C3D4', 3), -- Assuming 3 is the ID for Rest of Montreal
('J1E4F5', 4); -- Assuming 4 is the ID for Outside Montreal

INSERT INTO Workshop (name) VALUES ('Wednesday DIY'), ('Regular DIY'), ('Moonday'), ('Special Event'), ('Other');

INSERT INTO PrimaryGender (gender_name) VALUES ('Male'), ('Female'), ('Other');

INSERT INTO GenderIdentity (type) VALUES
('Agender'),
('Bigender'),
('Demigender'),
('Female'),
('Gender Fluid'),
('Gender Neutral'),
('Gender Non-Conforming'),
('Genderqueer'),
('Intersex'),
('Male'),
('Neurogender'),
('Non-Binary'),
('Polygender'),
('Questioning'),
('Transgender'),
('Two-Spirit'),
('Xenogender');
