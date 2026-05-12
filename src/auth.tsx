import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';

const API = 'http://localhost:8084';
const TOKEN_KEY = 'reos_token';
const VERIFY_INTERVAL_MS = 60 * 1000; 

interface AuthState {
  token: string | null;
  ready: boolean;  
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: sessionStorage.getItem(TOKEN_KEY),
    ready: false,
    loading: false,
    error: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const verify = useCallback(async (t: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/verify/account`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  // ── Limpia sesión ─────────────────────────────────────────────────────
  const clearSession = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setState({ token: null, ready: true, loading: false, error: null });
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);


  const startInterval = useCallback((t: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      const valid = await verify(t);
      if (!valid) clearSession();
    }, VERIFY_INTERVAL_MS);
  }, [verify, clearSession]);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setState((s) => ({ ...s, ready: true }));
      return;
    }
    verify(stored).then((valid) => {
      if (valid) {
        setState({ token: stored, ready: true, loading: false, error: null });
        startInterval(stored);
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
        setState({ token: null, ready: true, loading: false, error: null });
      }
    });
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ─────────────────────────────────────────────────────────────
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`${API}/auth/account/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const msg = res.status === 401 ? 'Credenciales incorrectas' : `Error del servidor (${res.status})`;
        setState((s) => ({ ...s, loading: false, error: msg }));
        return false;
      }

      const data = await res.json();
      const token: string = data.token;
      sessionStorage.setItem(TOKEN_KEY, token);
      setState({ token, ready: true, loading: false, error: null });
      startInterval(token);
      return true;
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'No se pudo conectar con el servidor' }));
      return false;
    }
  }, [startInterval]);

  // ── Logout manual ─────────────────────────────────────────────────────
  const logout = useCallback(() => clearSession(), [clearSession]);

  // Mientras verifica al arrancar no renderiza nada (evita flash de login)
  if (!state.ready) return null;

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}
