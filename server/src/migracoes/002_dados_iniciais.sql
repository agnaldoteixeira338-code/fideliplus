INSERT INTO users (cpf, celular, email, password_hash, role, nome)
VALUES ('000.000.000-00', '(11) 90000-0000', 'demo.cliente@fideli.com', NULL, 'cliente', 'Cliente Demo')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (cpf, celular, email, password_hash, role, nome)
VALUES ('111.111.111-11', '(11) 90000-1111', 'demo.dono@fideli.com', NULL, 'dono', 'Dono Demo')
ON CONFLICT (email) DO NOTHING;

INSERT INTO establishments (owner_id, nome, endereco, cidade, estado, latitude, longitude, telefone, hora_abertura, hora_fechamento, saude_parceiro, ativo)
SELECT u.id, 'Padaria Demo FIDELI+', 'Rua das Flores, 123', 'São Paulo', 'SP', -23.5505, -46.6333, '(11) 3000-0000', '07:00', '20:00', true, true
FROM users u
WHERE u.email = 'demo.dono@fideli.com'
  AND NOT EXISTS (SELECT 1 FROM establishments e WHERE e.owner_id = u.id AND e.nome = 'Padaria Demo FIDELI+');

INSERT INTO discount_rules (establishment_id, visitas_necessarias, percentual_desconto, ativo)
SELECT e.id, 3, 10.00, true
FROM establishments e
WHERE e.nome = 'Padaria Demo FIDELI+'
  AND NOT EXISTS (SELECT 1 FROM discount_rules r WHERE r.establishment_id = e.id AND r.visitas_necessarias = 3);

INSERT INTO discount_rules (establishment_id, visitas_necessarias, percentual_desconto, ativo)
SELECT e.id, 5, 20.00, true
FROM establishments e
WHERE e.nome = 'Padaria Demo FIDELI+'
  AND NOT EXISTS (SELECT 1 FROM discount_rules r WHERE r.establishment_id = e.id AND r.visitas_necessarias = 5);
