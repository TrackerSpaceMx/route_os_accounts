interface ConfirmDialogProps {
  visible: boolean;
  accountName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ visible, accountName, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(5,11,24,0.82)',
        zIndex: 40,
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--bdr)',
        borderRadius: 14,
        width: 360,
        padding: 24,
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-alert-triangle" style={{ color: '#EF4444', fontSize: 18 }} />
          Eliminar cuenta
        </div>
        <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 20 }}>
          ¿Seguro que deseas eliminar la cuenta{' '}
          <b style={{ color: 'var(--cyan)' }}>{accountName}</b>?{' '}
          Esta acción no se puede deshacer.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn-danger" onClick={onConfirm}>
            <i className="ti ti-trash" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
