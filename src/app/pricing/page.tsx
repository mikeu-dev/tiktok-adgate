'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';

export default function PricingPage() {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            description: 'Perfect for casual users',
            features: [
                'Unlimited Downloads',
                'No Watermark',
                'Basic History (Last 5)',
                'Standard Speed',
                'Ad-Supported'
            ],
            buttonText: 'Get Started',
            buttonVariant: 'outline' as const,
            popular: false
        },
        {
            name: 'Pro',
            price: '$9.99',
            period: '/month',
            description: 'For power creators & agencies',
            features: [
                'Everything in Free',
                'Unlimited History',
                'Ad-Free Experience',
                'Priority High-Speed Servers',
                'Bulk Download (Coming Soon)',
                'Analytics Dashboard'
            ],
            buttonText: 'Upgrade to Pro',
            buttonVariant: 'default' as const,
            popular: true
        }
    ];

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-16 md:py-24 min-h-screen">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold font-headline mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                    >
                        Simple, Transparent Pricing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground"
                    >
                        Choose the plan that fits your needs. No hidden fees.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <Card className={`h-full flex flex-col relative overflow-hidden ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : 'border-border'}`}>
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                                        POPULAR
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-4xl font-extrabold">{plan.price}</span>
                                        {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                                    </div>
                                    <CardDescription className="mt-2 text-base">{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="h-5 w-5 text-green-500 shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full h-11 text-base font-semibold" variant={plan.buttonVariant}>
                                        {plan.buttonText}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
