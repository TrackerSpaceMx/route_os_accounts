import { useState } from 'react';
import type { Account } from '../types';
import { fmtDate } from '../utils';
import pslog from '../assets/PSLOG LOGO .png';

interface DashboardProps {
  accounts: Account[];
  loading: boolean;
  onNew: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  onRefresh: () => void;
}

export function Dashboard({ accounts, loading, onNew, onDelete, onLogout, onRefresh }: DashboardProps) {
  const [query, setQuery] = useState('');

  const filtered = accounts.filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return [a.name, a.slug, a.rfc, a.company].some((v) => v.toLowerCase().includes(q));
  });

  const latest = accounts[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <img src={pslog} alt="Logo" style={{ width: 110, height: 110, borderRadius: 6 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={onRefresh} title="Recargar" disabled={loading}>
            <i className={`ti ti-refresh ${loading ? 'spin' : ''}`} />
          </button>
          <button className="btn-ghost" onClick={onLogout} title="Cerrar sesión">
            <i className="ti ti-logout" /> Salir
          </button>
          <button className="btn-primary" onClick={onNew}>
            <i className="ti ti-plus" /> Nueva cuenta
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 24, flex: 1 }}>
        {/* Stats */}
        <div className="stats-row">
          <div className="stat c-cyan">
            <div className="stat-label">Total cuentas</div>
            <div className="stat-val">{loading ? '...' : accounts.length}</div>
            <div className="stat-sub">registradas en el sistema</div>
          </div>
          <div className="stat c-green">
            <div className="stat-label">Última creación</div>
            <div className="stat-val" style={{ fontSize: 14, paddingTop: 6 }}>
              {latest ? latest.name : '—'}
            </div>
            <div className="stat-sub">
              {latest ? fmtDate(latest.created_at) : 'sin registros aún'}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">ID más reciente</div>
            <div className="stat-val" style={{ fontSize: 18, paddingTop: 4, fontFamily: 'var(--mono)', color: 'var(--cyan)' }}>
              {latest ? String(latest.id).padStart(3, '0') : '—'}
            </div>
            <div className="stat-sub">account id</div>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <div className="table-toolbar">
            <div className="search-box">
              <i className="ti ti-search" style={{ color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Buscar por nombre, slug, RFC o empresa..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--t1)', fontSize: 13, flex: 1, fontFamily: 'var(--font)' }}
              />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: 70 }}>#</th>
                  <th style={{ width: 120 }}>Slug</th>
                  <th>Nombre</th>
                  <th>Empresa</th>
                  <th style={{ width: 108 }}>RFC</th>
                  <th style={{ width: 140 }}>Creación</th>
                  <th style={{ width: 68 }}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <i className="ti ti-loader-2 spin" style={{ fontSize: 28, display: 'block', marginBottom: 10, color: 'var(--acc)' }} />
                        <p style={{ fontSize: 13 }}>Cargando cuentas...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <i className="ti ti-inbox" style={{ fontSize: 34, display: 'block', marginBottom: 10, color: 'var(--muted)' }} />
                        <p style={{ fontSize: 13 }}>
                          {accounts.length ? 'Sin resultados para tu búsqueda' : 'Aún no hay cuentas registradas'}
                        </p>
                        {!accounts.length && (
                          <small>Haz clic en "Nueva cuenta" para comenzar</small>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id}>
                      <td><span className="dpill">{String(a.id).padStart(3, '0')}</span></td>
                      <td style={{ color: 'var(--cyan)', fontFamily: 'var(--mono)', fontSize: 11 }}>{a.slug}</td>
                      <td style={{ fontWeight: 500 }}>{a.name}</td>
                      <td style={{ color: 'var(--t2)' }}>{a.company}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t2)' }}>{a.rfc}</td>
                      <td style={{ color: 'var(--t3)', fontSize: 11 }}>{fmtDate(a.created_at)}</td>
                      <td>
                        <button
                          className="icon-btn del"
                          onClick={() => onDelete(String(a.id))}
                          title="Eliminar"
                        >
                          <i className="ti ti-trash" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}