import { useEffect, useRef } from 'react';
import { Icon } from './Icon';
export function QuickAdd() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const restoreFocus = () => trigger.current?.focus();
    element?.addEventListener('close', restoreFocus);
    return () => element?.removeEventListener('close', restoreFocus);
  }, []);
  return <>
    <button ref={trigger} className="quick-add" aria-label="Öppna snabbmeny" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><Icon name="plus" size={28}/></button>
    <dialog ref={dialog} className="quick-dialog" aria-labelledby="quick-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-header"><h2 id="quick-title">Vad vill du lägga till?</h2><button autoFocus className="icon-button" aria-label="Stäng snabbmeny" onClick={() => dialog.current?.close()}><Icon name="close"/></button></div>
      <p className="muted">Snabbregistrering kommer i nästa steg.</p>
      <div className="quick-option" aria-disabled="true"><Icon name="notes"/><div><strong>Ny anteckning</strong><span>Samla tankar och det du lär dig</span></div><span className="soon">Snart</span></div>
      <div className="quick-option" aria-disabled="true"><Icon name="tasks"/><div><strong>Ny uppgift</strong><span>Gör plats för nästa lilla steg</span></div><span className="soon">Snart</span></div>
    </dialog>
  </>;
}
