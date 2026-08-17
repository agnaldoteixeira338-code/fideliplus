import { QRCodeSVG } from 'qrcode.react';

export default function QrCodeAcesso() {
  const url = window.location.origin;

  return (
    <div className="page">
      <h1>QR Code de Acesso Rápido</h1>
      <p className="subtitle">
        Mostre esse QR code para o cliente escanear com o celular — ele abre direto a tela de login/cadastro do
        FIDELI+ no celular dele.
      </p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 40 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid var(--gray-100)' }}>
          <QRCodeSVG value={url} size={280} fgColor="#7a0619" level="M" />
        </div>
        <p className="subtitle" style={{ textAlign: 'center' }}>{url}</p>
      </div>
    </div>
  );
}
