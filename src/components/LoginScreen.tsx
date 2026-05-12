import { useState } from 'react';
import { useAuth } from '../auth';
import pslog from '../assets/PSLOG LOGO .png';

export function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSubmit = async () => {
    setTouched(true);
    if (!username.trim() || !password.trim()) return;
    await login(username.trim(), password.trim());
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const fi = (hasError: boolean, mono = false): React.CSSProperties => ({
    background: 'var(--bg3)',
    border: `1px solid ${hasError ? '#EF4444' : 'var(--bdr)'}`,
    borderRadius: 8,
    padding: '10px 14px',
    color: 'var(--t1)',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    fontFamily: mono ? 'var(--mono)' : 'var(--font)',
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'var(--bg)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--bg2)',
        border: '1px solid var(--bdr)',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--bg3)',
          borderBottom: '1px solid var(--bdr)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}>
          <img src={pslog} alt="Logo" style={{ width: 120, height: 120, borderRadius: 12 }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>
              Route<span style={{ color: 'var(--cyan)' }}> Os</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>
              Sistema de gestión de cuentas
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Error banner */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.10)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <i className="ti ti-alert-circle" />
              {error}
            </div>
          )}

          {/* Usuario */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 11, color: 'var(--t2)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 500 }}>
              Usuario
            </label>
            <input
              style={fi(touched && !username.trim())}
              type="text"
              placeholder="tu_usuario"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={onKey}
              disabled={loading}
            />
            {touched && !username.trim() && (
              <span style={{ fontSize: 11, color: '#EF4444' }}>Campo requerido</span>
            )}
          </div>

          {/* Contraseña */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 11, color: 'var(--t2)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 500 }}>
              Contraseña
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                style={{ ...fi(touched && !password.trim()), paddingRight: 40 }}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKey}
                disabled={loading}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', padding: 0, fontSize: 16, display: 'flex', alignItems: 'center' }}
                tabIndex={-1}
              >
                <i className={showPass ? 'ti ti-eye-off' : 'ti ti-eye'} />
              </button>
            </div>
            {touched && !password.trim() && (
              <span style={{ fontSize: 11, color: '#EF4444' }}>Campo requerido</span>
            )}
          </div>

          {/* Submit */}
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px 16px', fontSize: 14, marginTop: 4, opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? <><i className="ti ti-loader-2" style={{ animation: 'spin 1s linear infinite' }} /> Iniciando sesión...</>
              : <><i className="ti ti-login" /> Iniciar sesión</>
            }
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}