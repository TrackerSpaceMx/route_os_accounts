import { useEffect, useState } from 'react';

export type ToastType = 'ok' | 'warn';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
}

export function Toast({ message, type, visible }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const colors = {
    ok: { border: 'rgba(16,185,129,0.3)', icon: 'ti ti-circle-check', iconColor: 'var(--green)' },
    warn: { border: 'rgba(239,68,68,0.3)', icon: 'ti ti-trash', iconColor: '#EF4444' },
  };
  const c = colors[type];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        background: 'var(--bg3)',
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        fontSize: 13,
        opacity: show && visible ? 1 : 0,
        transform: show && visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.3s, transform 0.3s',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <i className={c.icon} style={{ color: c.iconColor }} />
      <span>{message}</span>
    </div>
  );
}
