import { Icon } from '../../components/Icon';
import type { ViewId } from '../../app/navigation';
export function TodayView({ onNavigate }: { onNavigate: (view: ViewId) => void }) {
  const date = new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  return <>
    <header className="page-heading"><p className="eyebrow">{date}</p><h1>En sak i taget.</h1><p>Din plats för fokus, tankar och nästa steg.</p></header>
    <section className="welcome-card"><span className="pill">DIN STUDIEPLATS</span><h2>Mer utrymme<br/>för att lära.</h2><p>Samla dina studier på ett ställe.<br/>Enkelt, lugnt och på ditt sätt.</p><span className="welcome-symbol" aria-hidden="true"><Icon name="studies" size={64}/></span></section>
    <section className="section-block"><div className="section-heading"><h2>Aktuell kurs</h2><button className="text-button" onClick={() => onNavigate('studies')}>Studier <Icon name="arrow" size={16}/></button></div><div className="compact-card"><span className="small-icon"><Icon name="studies"/></span><div><h3>Här börjar din utbildning</h3><p>Din aktuella kurs visas här när kurser är på plats.</p></div></div></section>
    <section className="section-block"><div className="section-heading"><h2>Dagens uppgifter</h2><button className="text-button" onClick={() => onNavigate('tasks')}>Visa alla <Icon name="arrow" size={16}/></button></div><div className="compact-card"><span className="small-icon"><Icon name="tasks"/></span><div><h3>Plats för det viktigaste</h3><p>Dina uppgifter för idag samlas här i nästa steg.</p></div></div></section>
    <section className="section-block"><div className="section-heading"><h2>Senaste anteckningarna</h2><button className="text-button" onClick={() => onNavigate('notes')}>Visa alla <Icon name="arrow" size={16}/></button></div><div className="compact-card"><span className="small-icon"><Icon name="notes"/></span><div><h3>En tanke kan bli något stort</h3><p>Här får dina senaste anteckningar en egen plats.</p></div></div></section>
  </>;
}
