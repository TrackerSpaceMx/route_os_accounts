import { useState } from 'react';
import type { Account } from '../types';
import { toSlug } from '../utils';

interface AccountFormProps {
  accounts: Account[];
  onBack: () => void;
  onSave: (account: Account) => void;
}

interface FormErrors {
  name: boolean;
  company: boolean;
  slug: boolean;
  rfc: boolean;
  address: boolean;
  apiKey: boolean;
  secretKey: boolean;
}

export function AccountForm({ accounts, onBack, onSave }: AccountFormProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [slug, setSlug] = useState('');
  const [rfc, setRfc] = useState('');
  const [address, setAddress] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    name: false, company: false, slug: false,
    rfc: false, address: false, apiKey: false, secretKey: false,
  });

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(toSlug(val));
  };

  const validate = (): boolean => {
    const badSlug = !slug || !/^[a-z0-9-]+$/.test(slug) || !!accounts.find((a) => a.slug === slug);
    const errs: FormErrors = {
      name: !name.trim(),
      company: !company.trim(),
      slug: badSlug,
      rfc: !rfc.trim(),
      address: !address.trim(),
      apiKey: !apiKey.trim(),
      secretKey: !secretKey.trim(),
    };
    setErrors(errs);
    return !Object.values(errs).some(Boolean);
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const account: Account = {
      id: 0,
      slug,
      name: name.trim(),
      company: company.trim(),
      rfc: rfc.trim(),
      address: address.trim(),
      api_key: apiKey.trim(),
      secret_key: secretKey.trim(),
      created_at: new Date(),
    };

    onSave(account); // ← sin setTimeout
  };


  const fi = (hasError: boolean, mono = false) => ({
    background: 'var(--bg3)',
    border: `1px solid ${hasError ? '#EF4444' : 'var(--bdr)'}`,
    borderRadius: 8,
    padding: '9px 12px',
    color: 'var(--t1)',
    fontSize: 13,
    outline: 'none',
    width: '100%',
    fontFamily: mono ? 'var(--mono)' : 'var(--font)',
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={onBack}>
            <i className="ti ti-arrow-left" /> Regresar
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--bdr2)' }} />
          <span style={{ fontSize: 15, fontWeight: 600 }}>Nueva cuenta</span>
        </div>
        <div className="brand">
          <div className="brand-icon"><i className="ti ti-route" /></div>
          <div className="brand-name">Route<span style={{ color: 'var(--cyan)' }}> Os</span></div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {/* Section: Info */}
        <div className="section-label">
          <i className="ti ti-id-badge" /> Información de la cuenta
        </div>

        <div className="form-grid">
          {/* Nombre */}
          <div className="fg">
            <label className="fl">Nombre del titular</label>
            <input
              style={fi(errors.name)}
              type="text"
              placeholder="Ej. Carlos López"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            {errors.name && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>Campo requerido</span>}
          </div>

          {/* Empresa */}
          <div className="fg">
            <label className="fl">Empresa</label>
            <input
              style={fi(errors.company)}
              type="text"
              placeholder="Nombre de la empresa"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            {errors.company && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>Campo requerido</span>}
          </div>

          {/* Slug */}
          <div className="fg">
            <label className="fl">Slug</label>
            <input
              style={fi(errors.slug, true)}
              type="text"
              placeholder="empresa-norte"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <span style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>Solo letras minúsculas, números y guiones</span>
            {errors.slug && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>Slug inválido o ya en uso</span>}
          </div>

          {/* RFC */}
          <div className="fg">
            <label className="fl">RFC</label>
            <input
              style={fi(errors.rfc, true)}
              type="text"
              placeholder="XAXX010101000"
              maxLength={13}
              value={rfc}
              onChange={(e) => setRfc(e.target.value.toUpperCase())}
            />
            {errors.rfc && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>Campo requerido</span>}
          </div>

          {/* Dirección */}
          <div className="fg form-full">
            <label className="fl">Dirección</label>
            <input
              style={fi(errors.address)}
              type="text"
              placeholder="Calle, número, colonia, ciudad, estado"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>Campo requerido</span>}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--bdr)', margin: '20px 0' }} />

        {/* Section: Credentials */}
        <div className="section-label">
          <i className="ti ti-key" /> Credenciales
        </div>

        <div className="form-grid">
          {/* API Key */}
          <div className="fg">
            <label className="fl">API Key</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                style={{ ...fi(errors.apiKey, true), paddingRight: 36 }}
                type={showApiKey ? 'text' : 'password'}
                placeholder="rk_xxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                style={{ position: 'absolute', right: 10, background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', padding: 0, fontSize: 15, display: 'flex', alignItems: 'center' }}
              >
                <i className={showApiKey ? 'ti ti-eye-off' : 'ti ti-eye'} />
              </button>
            </div>
            {errors.apiKey && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>Campo requerido</span>}
          </div>

          {/* Secret Key */}
          <div className="fg">
            <label className="fl">Secret Key</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                style={{ ...fi(errors.secretKey, true), paddingRight: 36 }}
                type={showSecret ? 'text' : 'password'}
                placeholder="sk_xxxxxxxxxxxxxxxx"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                style={{ position: 'absolute', right: 10, background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', padding: 0, fontSize: 15, display: 'flex', alignItems: 'center' }}
              >
                <i className={showSecret ? 'ti ti-eye-off' : 'ti ti-eye'} />
              </button>
            </div>
            {errors.secretKey && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>Campo requerido</span>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--bdr)' }}>
          <button className="btn-ghost" onClick={onBack}>
            <i className="ti ti-x" /> Cancelar
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            <i className="ti ti-device-floppy" /> Guardar y regresar
          </button>
        </div>
      </div>
    </div>
  );
}