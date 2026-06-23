/**
 * useServerSync — call this once when the app is ready and a token exists.
 * It pulls all user data from the server and hydrates the local stores.
 */
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useProtocolStore } from '../store/useProtocolStore';
import { useScheduleStore } from '../store/useScheduleStore';
import { useVialStore } from '../store/useVialStore';
import { useTrackingStore } from '../store/useTrackingStore';

export function useServerSync() {
  const token = useAuthStore((s) => s.token);
  // Track which token we last synced for — re-sync when identity changes
  const lastSyncedToken = useRef<string | null>(null);

  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const syncProtocols = useProtocolStore((s) => s.syncFromServer);
  const syncSchedule = useScheduleStore((s) => s.syncFromServer);
  const syncVials = useVialStore((s) => s.syncFromServer);
  const syncTracking = useTrackingStore((s) => s.syncFromServer);

  useEffect(() => {
    if (!token || token === lastSyncedToken.current) return;
    lastSyncedToken.current = token;

    // Fan out — all syncs are independent
    Promise.allSettled([
      fetchProfile(),
      syncProtocols(),
      syncSchedule(),
      syncVials(),
      syncTracking(),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === 'rejected') console.warn('Sync error:', r.reason);
      });
    });
  }, [token]);
}
