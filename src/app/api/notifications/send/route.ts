import { NextResponse } from 'next/server';
import { eventEmitter } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const { userId, type, title, message } = await request.json();

    if (!userId || !type || !title || !message) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Emit the notification event
    eventEmitter.emit(`notification:${userId}`, {
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
    });

    return new NextResponse(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
