import { Icon } from '../components/Icon';
import { navigation, type ViewId } from './navigation';
export function BottomNavigation({ active, onChange }: { active: ViewId; onChange: (view: ViewId) => void }) {
  return <nav className="bottom-nav" aria-label="Huvudnavigation">{navigation.map(item => <button key={item.id} aria-current={active === item.id ? 'page' : undefined} onClick={() => onChange(item.id)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav>;
}
