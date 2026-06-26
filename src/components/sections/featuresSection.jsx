import BentoGrid from '../ui/BentoGrid';
import Accordion from '../ui/Accordion';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function FeaturesSection() {
  const isMobile = useIsMobile();
  return (
    <section id="features" aria-labelledby="features-heading" className="px-6 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 id="features-heading" className="text-3xl md:text-4xl font-semibold text-[var(--text-on-dark)] mb-3">Built for every layer of automation</h2>
        <p className="text-[var(--text-on-dark-muted)]">From security to scale, Armory handles the infrastructure so you can focus on logic.</p>
      </div>
      {isMobile ? <Accordion /> : <BentoGrid />}
    </section>
  );
}