const HOSPITAIS = [
  { nome: 'Hospital São Lucas', endereco: 'Av. Paulista, 1500', telefone: '(11) 3200-1000' },
  { nome: 'Hospital Santa Clara', endereco: 'Rua Augusta, 800', telefone: '(11) 3200-2000' },
  { nome: 'Hospital Vida Nova', endereco: 'Av. Rebouças, 300', telefone: '(11) 3200-3000' },
];

const FARMACIAS = [
  { nome: 'Farmácia Popular', endereco: 'Rua das Flores, 45', telefone: '(11) 3300-1000' },
  { nome: 'Drogaria Bem Estar', endereco: 'Av. Ipiranga, 900', telefone: '(11) 3300-2000' },
  { nome: 'Farmácia Central', endereco: 'Rua Direita, 120', telefone: '(11) 3300-3000' },
];

const MEDICOS = [
  { nome: 'Dr. Carlos Mendes', especialidade: 'Cardiologista', endereco: 'Av. Paulista, 1500', telefone: '(11) 3200-1010' },
  { nome: 'Dra. Ana Beatriz', especialidade: 'Dermatologista', endereco: 'Rua Augusta, 800', telefone: '(11) 3200-2010' },
  { nome: 'Dr. Pedro Alves', especialidade: 'Ortopedista', endereco: 'Av. Rebouças, 300', telefone: '(11) 3200-3010' },
  { nome: 'Dra. Fernanda Lima', especialidade: 'Clínico Geral', endereco: 'Rua das Flores, 45', telefone: '(11) 3200-4010' },
  { nome: 'Dr. Ricardo Souza', especialidade: 'Pediatra', endereco: 'Av. Ipiranga, 900', telefone: '(11) 3200-5010' },
];

function withDistance(list) {
  return list.map((item, i) => ({ ...item, distanciaKm: Number((0.8 + i * 0.7).toFixed(1)) })).sort(
    (a, b) => a.distanciaKm - b.distanciaKm
  );
}

export function nearbyHospitals() {
  return withDistance(HOSPITAIS);
}

export function nearbyPharmacies() {
  return withDistance(FARMACIAS);
}

export function nearbyDoctors(especialidade) {
  const list = especialidade
    ? MEDICOS.filter((m) => m.especialidade.toLowerCase() === especialidade.toLowerCase())
    : MEDICOS;
  return withDistance(list);
}

export function availableDoctorsFor(especialidade) {
  return nearbyDoctors(especialidade);
}
