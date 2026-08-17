UPDATE users
SET password_hash = '$2a$10$puB826sE83eaCgoL225p9O2bYV8DmHid7Y3xZWU9y4ftj8A7NIneW'
WHERE email IN ('demo.cliente@fideli.com', 'demo.dono@fideli.com');
