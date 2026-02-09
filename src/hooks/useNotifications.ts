import { useCallback, useEffect, useRef } from 'react';

export const useNotifications = () => {
  const permissionRef = useRef<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      permissionRef.current = Notification.permission;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    const perm = await Notification.requestPermission();
    permissionRef.current = perm;
    return perm === 'granted';
  }, []);

  const notify = useCallback((title: string, body: string, icon = '/favicon.ico') => {
    if (permissionRef.current !== 'granted') return;
    try {
      new Notification(title, { body, icon });
    } catch {
      // silent fail on unsupported environments
    }
  }, []);

  const scheduleStreakReminder = useCallback((streakDays: number) => {
    if (streakDays > 0) {
      // Check at 8pm if habits aren't done
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(20, 0, 0, 0);
      if (reminderTime > now) {
        const delay = reminderTime.getTime() - now.getTime();
        setTimeout(() => {
          notify(
            '⚠️ Streak at risk!',
            `Don't lose your ${streakDays}-day streak! Complete your habits now.`
          );
        }, delay);
      }
    }
  }, [notify]);

  return { requestPermission, notify, scheduleStreakReminder, permission: permissionRef.current };
};
