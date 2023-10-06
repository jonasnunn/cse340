-- Insert the Tony Stark record
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update the record so he is an admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete the record
DELETE FROM account
WHERE account_id = 1;

-- Modify the GM Hummer record
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Get some sport cars 
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Update the inventory records to modify the image and thumbnails paths
UPDATE inventory
SET inv_image = CONCAT('/images/vehicles/', SUBSTRING(inv_image, 9))
   ,inv_thumbnail = CONCAT('/images/vehicles/', SUBSTRING(inv_thumbnail, 9));
