
export const plans = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 999, // in cents
    }
];

export async function createCheckoutSession(planId: string, userId: string, userEmail?: string | null) {
    try {
        const response = await fetch('/api/payments/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID_PRO || '393630', // Default or from env
                userId,
                userEmail
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error('Checkout error:', error);
        throw error;
    }
}

export async function getSubscriptionStatus(userId: string) {
    // Placeholder
    return { status: 'active', plan: 'free' };
}
