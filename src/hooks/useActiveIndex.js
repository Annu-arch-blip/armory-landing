import { useState, useEffect } from 'react';
import { getActiveIndex, subscribeActiveIndex } from '../data/featuresStore';
export function useActiveIndex() {
  const [activeIndex, setActiveIndexState] = useState(getActiveIndex());
  useEffect(() => {
    const unsubscribe = subscribeActiveIndex((newIndex) => setActiveIndexState(newIndex));
    return unsubscribe;
  }, []);
  return activeIndex;
}