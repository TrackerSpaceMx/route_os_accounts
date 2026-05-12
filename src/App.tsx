import { useState, useCallback, useEffect } from 'react';
import './App.css';
import type { Account } from './types';
import { Dashboard } from './components/Dashboard';
import { AccountForm } from './components/AccountForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import type { ToastType } from './components/Toast';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './auth';

const API = 'http://localhost:8084';

type Screen = 'dashboard' | 'form';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

function AppInner() {
  const { token, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [animClass, setAnimClass] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'ok', visible: false });

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  // ── Carga cuentas desde el backend ────────────────────────────────────
  const fetchAccounts = useCallback(async () => {
    if (!token) return;
    setLoadingAccounts(true);
    try {
      const res = await fetch(`${API}/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) { showToast('Error al cargar las cuentas', 'warn'); return; }
      const data = await res.json();
      const accounts: Account[] = data.data.map((a: Account) => ({
        ...a,
        created_at: new Date(a.created_at),
      }));
      setAccounts(accounts);
    } catch {
      showToast('No se pudo conectar con el servidor', 'warn');
    } finally {
      setLoadingAccounts(false);
    }
  }, [token, logout, showToast]);

  // Carga al entrar al dashboard
  useEffect(() => {
    if (token && screen === 'dashboard') fetchAccounts();
  }, [token, screen]);  // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (next: Screen) => {
    setAnimClass(next === 'form' ? 'slide-enter' : 'slide-back');
    setScreen(next);
  };

  const handleSave = async (account: Account) => {
    try {
      const res = await fetch(`${API}/account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: account.slug,
          name: account.name,
          api_key: account.api_key,
          secret_key: account.secret_key,
          rfc: account.rfc,
          address: account.address,
          company_name: account.company,
        }),
      });

      if (res.status === 401) { logout(); return; }
      if (res.status === 409) { showToast('El slug o RFC ya está registrado', 'warn'); return; }
      if (!res.ok) { showToast('Error al crear la cuenta', 'warn'); return; }

      showToast(`Cuenta "${account.name}" creada exitosamente`, 'ok');
      goTo('dashboard');
    } catch {
      showToast('No se pudo conectar con el servidor', 'warn');
    }
  };
  
  const handleDeleteRequest = (id: string) => setDeleteTarget(id);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const a = accounts.find((x) => String(x.id) === deleteTarget);
    if (!a) return;

    try {
      const res = await fetch(`${API}/account/${a.slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) { logout(); return; }
      if (!res.ok) { showToast('Error al eliminar la cuenta', 'warn'); return; }

      setAccounts((prev) => prev.filter((x) => String(x.id) !== deleteTarget));
      showToast(`Cuenta "${a.name}" eliminada`, 'warn');
    } catch {
      showToast('No se pudo conectar con el servidor', 'warn');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Sesión cerrada', 'warn');
  };

  if (!token) return <LoginScreen />;

  const deleteAccount = accounts.find((a) => String(a.id) === deleteTarget);

  return (
    <div style={{ width: '100%', maxWidth: '100%', padding: '0 5%' }}>
      <div
        className="app"
        style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh' }}
        key={screen}
      >
        <div className={animClass} style={{ display: 'flex', flexDirection: 'column' }}>
          {screen === 'dashboard' ? (
            <Dashboard
              accounts={accounts}
              loading={loadingAccounts}
              onNew={() => goTo('form')}
              onDelete={handleDeleteRequest}
              onLogout={handleLogout}
              onRefresh={fetchAccounts}
            />
          ) : (
            <AccountForm
              accounts={accounts}
              onBack={() => goTo('dashboard')}
              onSave={handleSave}
            />
          )}
        </div>

        <ConfirmDialog
          visible={!!deleteTarget}
          accountName={deleteAccount ? `${deleteAccount.name} (${deleteAccount.slug})` : ''}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />

        <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      </div>
    </div>
  );
}

export default function App() {
  return <AppInner />;
}