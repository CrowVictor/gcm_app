import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

interface NotificationSetup {
  token?: string;
  error?: string;
}

class CapacitorService {
  private isNativePlatform = Capacitor.isNativePlatform();

  async setupPushNotifications(): Promise<NotificationSetup> {
    if (!this.isNativePlatform) {
      console.log('Push notifications are only available on native platforms');
      return { error: 'Not available on web platform' };
    }

    try {
      // Request permission for push notifications
      const permissionResult = await PushNotifications.requestPermissions();
      
      if (permissionResult.receive === 'granted') {
        // Register with FCM/APNS
        await PushNotifications.register();
        
        return new Promise((resolve) => {
          // Listen for registration success
          PushNotifications.addListener('registration', (token: Token) => {
            console.log('Push registration success, token: ' + token.value);
            resolve({ token: token.value });
          });

          // Listen for registration errors
          PushNotifications.addListener('registrationError', (error: any) => {
            console.error('Error on registration: ' + JSON.stringify(error));
            resolve({ error: error.message || 'Registration failed' });
          });

          // Listen for incoming notifications
          PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
            console.log('Push notification received: ', notification);
            // Handle foreground notification
            this.handleForegroundNotification(notification);
          });

          // Listen for notification actions
          PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push notification action performed', notification);
            // Handle notification tap when app is in background
            this.handleNotificationAction(notification);
          });
        });
      } else {
        return { error: 'Permission denied' };
      }
    } catch (error: any) {
      console.error('Error setting up push notifications:', error);
      return { error: error.message || 'Setup failed' };
    }
  }

  private handleForegroundNotification(notification: PushNotificationSchema) {
    // Show in-app notification or update UI
    console.log('Handling foreground notification:', notification);
    
    // Example: Show toast notification
    if (notification.title && notification.body) {
      // You could integrate this with your toast system
      // toast({
      //   title: notification.title,
      //   description: notification.body,
      // });
    }
  }

  private handleNotificationAction(notification: any) {
    // Handle notification tap - navigate to relevant screen
    console.log('Handling notification action:', notification);
    
    // Example: Navigate to appointments screen if it's an appointment reminder
    if (notification.notification?.data?.type === 'appointment_reminder') {
      // You could emit an event or call a navigation function here
      console.log('Navigate to appointment details');
    }
  }

  async scheduleLocalNotification(title: string, body: string, date: Date) {
    if (!this.isNativePlatform) {
      console.log('Local notifications are only available on native platforms');
      return;
    }

    try {
      // For appointment reminders, you might want to use Capacitor Local Notifications
      // This is a placeholder for the implementation
      console.log(`Scheduling notification: ${title} - ${body} for ${date}`);
      
      // Example implementation:
      // await LocalNotifications.schedule({
      //   notifications: [
      //     {
      //       title: title,
      //       body: body,
      //       id: Date.now(),
      //       schedule: { at: date },
      //       actionTypeId: 'appointment_reminder',
      //       extra: {
      //         type: 'appointment_reminder'
      //       }
      //     }
      //   ]
      // });
    } catch (error) {
      console.error('Error scheduling local notification:', error);
    }
  }

  // Example method to schedule appointment reminder
  async scheduleAppointmentReminder(appointmentData: any) {
    if (!appointmentData.schedule?.data || !appointmentData.schedule?.hora) {
      return;
    }

    try {
      const appointmentDate = new Date(`${appointmentData.schedule.data}T${appointmentData.schedule.hora}`);
      const reminderDate = new Date(appointmentDate.getTime() - (24 * 60 * 60 * 1000)); // 24 hours before

      await this.scheduleLocalNotification(
        'Lembrete de Consulta',
        `Você tem uma consulta de ${appointmentData.specialty?.nome} amanhã às ${appointmentData.schedule.hora}`,
        reminderDate
      );

      // Also schedule a notification 1 hour before
      const hourBeforeDate = new Date(appointmentDate.getTime() - (60 * 60 * 1000));
      await this.scheduleLocalNotification(
        'Consulta em 1 hora',
        `Sua consulta de ${appointmentData.specialty?.nome} é em 1 hora. Não se esqueça!`,
        hourBeforeDate
      );
    } catch (error) {
      console.error('Error scheduling appointment reminder:', error);
    }
  }

  // Send push notification token to backend
  async sendTokenToBackend(token: string) {
    try {
      // This would typically send the token to your backend
      // so it can send push notifications to this device
      console.log('Sending token to backend:', token);
      
      // Example API call:
      // await fetch('/api/register-push-token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token })
      // });
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }
}

export const capacitorService = new CapacitorService();

// Example Firebase configuration for push notifications
export const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Example usage:
// 1. Call capacitorService.setupPushNotifications() when user enables notifications
// 2. Call capacitorService.scheduleAppointmentReminder(appointmentData) after successful booking
// 3. Handle incoming notifications in your app's main component
