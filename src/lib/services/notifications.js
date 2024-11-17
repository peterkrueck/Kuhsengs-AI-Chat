import { writable } from 'svelte/store';
import { requestNotificationPermission, onMessageListener } from '../firebase';

export const notificationPermission = writable('default');
export const notificationEnabled = writable(false);

export async function initializeNotifications() {
  try {
    const permission = await Notification.requestPermission();
    notificationPermission.set(permission);
    
    if (permission === 'granted') {
      const token = await requestNotificationPermission();
      if (token) {
        notificationEnabled.set(true);
        setupMessageListener();
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
}

function setupMessageListener() {
  onMessageListener();
}

export function showNotification(title, body) {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png'
    });
  }
}

export async function toggleNotifications() {
  const currentValue = await new Promise(resolve => {
    notificationEnabled.subscribe(value => resolve(value))();
  });

  if (!currentValue) {
    const success = await initializeNotifications();
    notificationEnabled.set(success);
  } else {
    notificationEnabled.set(false);
  }
}
