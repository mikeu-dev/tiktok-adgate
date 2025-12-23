
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';
        const signature = request.headers.get('x-signature') || '';

        if (!secret) {
            return NextResponse.json({ error: 'Server config missing' }, { status: 500 });
        }

        // Verify signature
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(rawBody).digest('hex');

        if (digest !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        const customData = payload.meta.custom_data;
        const userId = customData?.user_id;

        console.log(`Received webhook: ${eventName} for user: ${userId}`);

        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            if (userId) {
                // Update user in Firestore
                await adminDb.collection('users').doc(userId).update({
                    role: 'pro',
                    subscriptionId: payload.data.id,
                    subscriptionStatus: payload.data.attributes.status,
                    updatedAt: new Date().toISOString()
                });
                console.log(`Updated user ${userId} to PRO`);
            }
        } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            if (userId) {
                await adminDb.collection('users').doc(userId).update({
                    role: 'free', // Revert to free
                    subscriptionStatus: payload.data.attributes.status,
                    updatedAt: new Date().toISOString()
                });
                console.log(`Downgraded user ${userId} to FREE`);
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
