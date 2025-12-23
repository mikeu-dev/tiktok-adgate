
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

export async function createCheckoutSession(planId: string) {
    // Placeholder for Stripe/LemonSqueezy integration
    console.log(`Creating checkout session for plan: ${planId}`);

    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ url: 'https://checkout.stripe.com/test-session' });
        }, 1000);
    });
}

export async function getSubscriptionStatus(userId: string) {
    // Placeholder
    return { status: 'active', plan: 'free' };
}
