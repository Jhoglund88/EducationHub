import { EmptyState } from '../../components/EmptyState';
export function TasksView() {
  return <><header className="page-heading"><p className="eyebrow">FOKUS & PLANERING</p><h1>Uppgifter</h1><p>Små steg framåt. I din egen takt.</p></header><div className="status-preview" aria-label="Planerade uppgiftsstatusar"><span>Idag</span><span>Senare</span><span>Klart</span></div><section className="surface"><EmptyState icon="tasks" title="En enklare väg framåt">Här kommer du att kunna organisera dina uppgifter i Idag, Senare och Klart.</EmptyState></section><p className="feature-hint">Uppgiftshantering kommer i nästa steg.</p></>;
}
