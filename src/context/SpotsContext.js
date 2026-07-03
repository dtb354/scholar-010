import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { fetchSpots } from '../api/spots';

const SpotsContext = createContext(undefined);

/**
 * Fetches the study spots from the online JSON once and shares them across the
 * list and map screens (single source of truth, one network request).
 */
export function SpotsProvider({ children }) {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchSpots();
      setSpots(data);
    } catch (e) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SpotsContext.Provider value={{ spots, loading, error, reload: load }}>
      {children}
    </SpotsContext.Provider>
  );
}

export function useSpots() {
  const ctx = useContext(SpotsContext);
  if (ctx === undefined) {
    throw new Error('useSpots must be used within a SpotsProvider');
  }
  return ctx;
}
