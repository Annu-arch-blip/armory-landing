import { useRef } from 'react';
import { FEATURES } from '../../data/featuresData';
import { setActiveIndex } from '../../data/featuresStore';
import { useActiveIndex } from '../../hooks/useActiveIndex';

export default function Accordion() {
  const activeIndex = useActiveIndex();
  function handleToggle(index) { setActiveIndex(activeIndex === index ? null : index); }
  return (
    <div className="flex flex-col gap-3">
      {FEATURES.map((feature, index) => (
        <AccordionItem key={feature.key} feature={feature} isOpen={activeIndex === index} onToggle={() => handleToggle(index)} />
      ))}
    </div>
  );
}

function AccordionItem({ feature, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const contentHeight = isOpen ? contentRef.current?.scrollHeight ?? 0 : 0;
  return (
    <div className={`rounded-2xl border overflow-hidden transition-colors duration-[350ms] ease-in-out ${isOpen ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)]' : 'bg-[var(--bg-surface)]/40 border-white/10'}`}>
      <button onClick={onToggle} aria-expanded={isOpen} className="w-full flex items-center justify-between text-left px-5 py-4 cursor-pointer">
        <span className="text-lg font-semibold text-[var(--text-on-dark)]">{feature.title}</span>
        <span className={`text-[var(--accent-primary)] transition-transform duration-[180ms] ease-out ${isOpen ? 'rotate-45' : 'rotate-0'}`}>+</span>
      </button>
      <div ref={contentRef} style={{ maxHeight: contentHeight }} className="overflow-hidden transition-[max-height] duration-[350ms] ease-in-out">
        <p className="px-5 pb-4 text-sm text-[var(--text-on-dark-muted)]">{feature.description}</p>
      </div>
    </div>
  );
}