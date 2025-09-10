import { useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  playSound?: boolean;
  soundType?: 'work' | 'break';
}

export const useNotifications = () => {
  // Demander la permission pour les notifications
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Créer un son audio
  const createAudioNotification = useCallback((soundType: 'work' | 'break' = 'work') => {
    try {
      // Créer un AudioContext pour générer des sons
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBeep = (frequency: number, duration: number, delay = 0) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      if (soundType === 'work') {
        // Son pour la fin du travail (3 bips courts)
        playBeep(800, 0.2, 0);
        playBeep(800, 0.2, 300);
        playBeep(800, 0.2, 600);
      } else {
        // Son pour la fin de la pause (2 bips longs)
        playBeep(600, 0.4, 0);
        playBeep(600, 0.4, 500);
      }
    } catch (error) {
      console.warn('Audio notification failed:', error);
    }
  }, []);

  // Fonction principale de notification
  const showNotification = useCallback(async (options: NotificationOptions) => {
    const { title, body, icon = '/favicon.ico', playSound = true, soundType = 'work' } = options;

    // Jouer le son
    if (playSound) {
      createAudioNotification(soundType);
    }

    // Afficher la notification du navigateur
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: 'pomodoro-timer',
          requireInteraction: false,
          silent: false
        });

        // Auto-fermer la notification après 5 secondes
        setTimeout(() => {
          notification.close();
        }, 5000);

        return notification;
      } catch (error) {
        console.warn('Browser notification failed:', error);
      }
    }

    return null;
  }, [createAudioNotification]);

  return {
    requestPermission,
    showNotification
  };
};
