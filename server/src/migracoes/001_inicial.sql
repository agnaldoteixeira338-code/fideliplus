CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  cpf VARCHAR(14) UNIQUE,
  celular VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(10) NOT NULL CHECK (role IN ('cliente', 'dono')),
  nome VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS establishments (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  endereco VARCHAR(255),
  cidade VARCHAR(120),
  estado VARCHAR(2),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  telefone VARCHAR(20),
  logo_url VARCHAR(500),
  hora_abertura VARCHAR(5),
  hora_fechamento VARCHAR(5),
  saude_parceiro BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS discount_rules (
  id SERIAL PRIMARY KEY,
  establishment_id INTEGER NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  visitas_necessarias INTEGER NOT NULL CHECK (visitas_necessarias > 0),
  percentual_desconto NUMERIC(5,2) NOT NULL CHECK (percentual_desconto > 0),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  establishment_id INTEGER NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  visited_at TIMESTAMP NOT NULL DEFAULT now(),
  desconto_aplicado NUMERIC(5,2),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  establishment_id INTEGER NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (client_id, establishment_id)
);

CREATE TABLE IF NOT EXISTS health_data (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plano_nome VARCHAR(255),
  carteirinha VARCHAR(100),
  validade DATE,
  alergias TEXT,
  condicoes_especiais TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medical_requests (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  especialidade VARCHAR(120) NOT NULL,
  data_preferencial DATE NOT NULL,
  horario_preferencial VARCHAR(5) NOT NULL,
  medico_nome VARCHAR(255),
  hospital_nome VARCHAR(255),
  endereco VARCHAR(255),
  status VARCHAR(12) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'concluido', 'cancelado')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visits_client_establishment ON visits (client_id, establishment_id);
CREATE INDEX IF NOT EXISTS idx_discount_rules_establishment ON discount_rules (establishment_id);
CREATE INDEX IF NOT EXISTS idx_establishments_owner ON establishments (owner_id);
