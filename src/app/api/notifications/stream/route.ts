import { NextRequest, NextResponse } from 'next/server';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for connected clients
const clients = new Map();
const eventEmitter = new EventEmitter();

// Handle SSE connections
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    return new NextResponse('User ID is required', { status: 400 });
  }

  // Set up SSE response
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  const clientId = uuidv4();

  const sendEvent = (data: any) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    writer.write(encoder.encode(payload));
  };

  // Send initial connection event
  sendEvent({ type: 'connected', message: 'Connected to notification stream' });

  // Handle client disconnection
  const cleanup = () => {
    clients.delete(clientId);
    eventEmitter.off(`notification:${userId}`, handleNotification);
    writer.close();
  };

  // Handle notifications for this user
  const handleNotification = (data: any) => {
    sendEvent(data);
  };

  // Store client connection
  clients.set(clientId, { sendEvent, userId });
  eventEmitter.on(`notification:${userId}`, handleNotification);

  // Set up cleanup on client disconnect
  request.signal.addEventListener('abort', cleanup);

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Helper function to send notifications to a specific user
export function sendNotification(userId: string, notification: any) {
  eventEmitter.emit(`notification:${userId}`, {
    ...notification,
    timestamp: new Date().toISOString(),
  });
}

// Example of how to use this from another API route:
// import { sendNotification } from './stream/route';
// sendNotification(userId, { type: 'info', title: 'New Message', message: 'You have a new message' });
