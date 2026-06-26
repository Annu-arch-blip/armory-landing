import { FEATURES } from '../../data/featuresData';
import { setActiveIndex } from '../../data/featuresStore';
import { useActiveIndex } from '../../hooks/useActiveIndex';

const GRID_TEMPLATE = `"secure secure agent" "cloud cloud agent" "data data data"`;

export default function BentoGrid() {
  const activeIndex = useActiveIndex();
  return (
    <div className="grid grid-cols-3 gap-4" style={{ gridTemplateAreas: GRID_TEMPLATE, gridAutoRows: '170px' }}>
      {FEATURES.map((feature, index) => (
        <BentoCard key={feature.key} feature={feature} index={index} isActive={activeIndex === index} />
      ))}
    </div>
  );
}

function BentoCard({ feature, index, isActive }) {
  return (
    <div
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
      style={{ gridArea: feature.gridArea }}
      className={`rounded-2xl p-6 border flex flex-col justify-end cursor-default transition-all duration-[350ms] ease-in-out ${isActive ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)] scale-[1.02]' : 'bg-[var(--bg-surface)]/40 border-white/10'}`}
    >
      <h3 className="text-xl font-semibold text-[var(--text-on-dark)] mb-2">{feature.title}</h3>
      <p className="text-sm text-[var(--text-on-dark-muted)]">{feature.description}</p>
    </div>
  );
}