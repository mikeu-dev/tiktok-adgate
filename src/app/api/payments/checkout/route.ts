
import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase'; // Note: This is client-side auth, we need server-side validation properly or pass UID securely. 
// For this implementation, we will assume the client passes the UUID and we trust it for the MVP, 
// OR better, we use a custom header if we had the Admin SDK. 
// Since we only have client SDK in this project so far:
// We will accept userId in the body. In a production app, verify the ID token.

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { variantId, userId, userEmail } = body;

        if (!variantId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const apiKey = process.env.LEMONSQUEEZY_API_KEY;
        const storeId = process.env.LEMONSQUEEZY_STORE_ID;

        if (!apiKey || !storeId) {
            console.error('Lemon Squeezy config missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: {
                        checkout_data: {
                            custom: {
                                user_id: userId, // Pass userId as custom data to webhook
                            },
                            email: userEmail
                        },
                        product_options: {
                            redirect_url: `${request.headers.get('origin')}/history`,
                        }
                    },
                    relationships: {
                        store: {
                            data: {
                                type: 'stores',
                                id: storeId.toString()
                            }
                        },
                        variant: {
                            data: {
                                type: 'variants',
                                id: variantId.toString()
                            }
                        }
                    }
                }
            })
        });

        const data = await response.json();

        if (data.errors) {
            console.error('Lemon Squeezy API Error:', data.errors);
            return NextResponse.json({ error: 'Payment provider error' }, { status: 500 });
        }

        return NextResponse.json({ url: data.data.attributes.url });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
