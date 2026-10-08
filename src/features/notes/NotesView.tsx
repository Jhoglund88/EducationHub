import { EmptyState } from '../../components/EmptyState';
export function NotesView() {
  return <><header className="page-heading"><p className="eyebrow">TANKAR & LÄRDOMAR</p><h1>Anteckningar</h1><p>Det du vill komma ihåg, samlat på ett ställe.</p></header><section className="surface"><EmptyState icon="notes" title="Ge dina tankar en plats">Här kommer du att kunna samla, redigera och återvända till dina anteckningar.</EmptyState></section><p className="feature-hint">Anteckningshantering kommer i nästa steg.</p></>;
}
