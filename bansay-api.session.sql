-- Mangorangca SQLTools

-- @block
UPDATE users
SET status = 'Active'
WHERE username = 'mangorangca';

-- @block
SELECT * FROM users WHERE username = 'mangorangca';

-- @block
SELECT * FROM users;

-- @block
UPDATE users
SET status = 'Active'
WHERE username = 'sawano';

-- @block
SELECT * FROM users WHERE username = 'nazi';

-- @block
SELECT * FROM liabilities;

-- @block
UPDATE liabilities
SET status = 'Paid'
WHERE id = 2;

-- @block
UPDATE liabilities
SET status = 'Cancelled'
WHERE id = 13;
