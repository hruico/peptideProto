/**
 * notifications.ts — Schedules local push notifications for peptide doses.
 *
 * NOTE: expo-notifications does not work in Expo Go on SDK 53+.
 * All functions gracefully no-op when running in Expo Go so the rest of
 * the app is unaffected. Notifications will work once you build a
 * development build (`npx expo run:android` / `npx expo run:ios`).
 */
import Constants from 'expo-constants';
import type { ScheduledPeptide } from '../store/useScheduleStore';
import type { ProtocolExtended } from '../data/protocols';
import { getPeptideById } from '../data/peptides';

// Detect Expo Go — appOwnership === 'expo' means we're inside Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Lazily import expo-notifications only when NOT in Expo Go to avoid the crash
let Notifications: typeof import('expo-notifications') | null = null;
if (!isExpoGo) {
  try {
    // Dynamic require so Metro doesn't blow up at parse time in Expo Go
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Notifications = require('expo-notifications');

    Notifications!.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // Still no-op if something else goes wrong
    Notifications = null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Notifications) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Schedule daily dose reminder notifications for a scheduled peptide.
 * Returns notification IDs (empty array in Expo Go).
 */
export async function schedulePeptideNotifications(
  sp: ScheduledPeptide
): Promise<string[]> {
  if (!Notifications) return [];
  const granted = await requestNotificationPermission();
  if (!granted) return [];

  const peptide = getPeptideById(sp.peptideId);
  const name = peptide?.name ?? sp.peptideId;
  const ids: string[] = [];

  for (const time of sp.times) {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr ?? '0', 10);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for your ${name} dose`,
        body: `${sp.dose} ${sp.unit} — tap to log`,
        data: { peptideId: sp.peptideId, scheduleId: sp.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    ids.push(id);
  }

  return ids;
}

/**
 * Schedule notifications for every peptide in a protocol.
 * Returns notification IDs (empty array in Expo Go).
 */
export async function scheduleProtocolNotifications(
  protocol: ProtocolExtended
): Promise<string[]> {
  if (!Notifications) return [];
  const granted = await requestNotificationPermission();
  if (!granted) return [];

  const ids: string[] = [];

  for (const entry of protocol.schedule) {
    const peptide = getPeptideById(entry.peptideId);
    const name = peptide?.name ?? entry.peptideId;
    const hour = deriveHourFromTiming(entry.timing);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${protocol.name} — ${name}`,
        body: `${entry.dose} ${entry.unit} · ${entry.frequency}${entry.timing ? ' · ' + entry.timing : ''}`,
        data: { protocolId: protocol.id, peptideId: entry.peptideId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
    ids.push(id);
  }

  return ids;
}

/** Cancel a set of notification IDs. No-op in Expo Go. */
export async function cancelNotifications(ids: string[]): Promise<void> {
  if (!Notifications) return;
  await Promise.all(ids.map((id) => Notifications!.cancelScheduledNotificationAsync(id)));
}

/** Cancel ALL scheduled notifications. No-op in Expo Go. */
export async function cancelAllNotifications(): Promise<void> {
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function deriveHourFromTiming(timing?: string): number {
  if (!timing) return 9;
  const t = timing.toLowerCase();
  if (t.includes('bed') || t.includes('night')) return 22;
  if (t.includes('afternoon')) return 14;
  if (t.includes('post') || t.includes('workout')) return 18;
  if (t.includes('morning') || t.includes('fasted')) return 7;
  return 9;
}
