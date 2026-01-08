import { EventEmitter } from 'events';

// Shared event emitter for notifications
export const eventEmitter = new EventEmitter();

// Helper function to send notifications to a specific user
export function sendNotification(userId: string, notification: any) {
  eventEmitter.emit(`notification:${userId}`, {
    ...notification,
    timestamp: new Date().toISOString(),
  });
}
