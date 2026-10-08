import { EmptyState } from '../../components/EmptyState';
export function StudiesView() {
  return <><header className="page-heading"><p className="eyebrow">DIN UTBILDNING</p><h1>Studier</h1><p>En tydlig plats för kurser och projekt.</p></header><section className="surface study-section"><h2>Kurser</h2><EmptyState icon="studies" title="Det du lär dig">Dina kurser och deras grundinformation kommer att samlas här.</EmptyState></section><section className="surface study-section"><h2>Projekt</h2><EmptyState icon="notes" title="Det du skapar">Samla relaterade anteckningar och uppgifter kring dina projekt i nästa steg.</EmptyState></section></>;
}
