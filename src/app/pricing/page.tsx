'use client';

import { Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { createCheckoutSession } from '@/lib/payments';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSubscribe = async (planId: string) => {
        if (!user) {
            await signInWithGoogle();
            return;
        }

        if (planId === 'free') {
            router.push('/');
            return;
        }

        try {
            setLoadingPlan(planId);
            const session = await createCheckoutSession(planId, user.uid, user.email);
            if (session.url) {
                window.location.href = session.url;
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setLoadingPlan(null);
        }
    };

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            description: 'Essential for casual downloading',
            features: [
                { name: 'Unlimited Downloads', tooltip: 'Download as many videos as you want' },
                { name: 'No Watermark', tooltip: 'Get clean videos without TikTok logo' },
                { name: 'Standard Speed', tooltip: 'Normal download speeds' },
                { name: 'Ad-Supported', tooltip: 'Contains advertisements' },
                { name: 'Basic History (Last 5)', tooltip: 'Recent history only' }
            ],
            buttonText: 'Get Started',
            buttonVariant: 'outline' as const,
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$9.99',
            period: '/month',
            description: 'For creators who need the best',
            features: [
                { name: 'Everything in Free' },
                { name: 'Unlimited History', tooltip: 'Access your entire download history forever' },
                { name: 'Ad-Free Experience', tooltip: 'No interruptions, faster workflow' },
                { name: 'Priority High-Speed', tooltip: 'Fastest servers reserved for pro users' },
                { name: 'Bulk Download (Soon)', tooltip: 'Download all videos from a profile' },
                { name: 'Analytics (Soon)', tooltip: 'Track your download stats' }
            ],
            buttonText: 'Upgrade to Pro',
            buttonVariant: 'default' as const,
            popular: true
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-20">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Simple Pricing, <br />
                            <span className="text-primary">Powerful Features</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-xl text-muted-foreground"
                    >
                        Start for free, upgrade when you need more power. No hidden fees, cancel anytime.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 + 0.3 }}
                            className={`h-full ${plan.popular ? 'md:-mt-8 md:mb-8' : ''}`}
                        >
                            <Card className={`h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.popular
                                ? 'border-primary/50 shadow-2xl scale-100 md:scale-105 z-10 bg-card/60 backdrop-blur-sm'
                                : 'border-border/50 hover:border-border bg-card/40 backdrop-blur-sm'
                                }`}>

                                {plan.popular && (
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
                                )}

                                <CardHeader className="pb-8">
                                    {plan.popular && (
                                        <div className="mb-2">
                                            <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                                MOST POPULAR
                                            </Badge>
                                        </div>
                                    )}
                                    <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                                    <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
                                    <div className="mt-6 flex items-baseline gap-1">
                                        <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                                        {plan.period && <span className="text-muted-foreground font-medium">{plan.period}</span>}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-grow">
                                    <div className="space-y-4">
                                        <div className="h-px w-full bg-border/50 mb-6" />
                                        <TooltipProvider>
                                            <ul className="space-y-4">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className={`mt-1 rounded-full p-1 ${plan.popular ? 'bg-primary/10' : 'bg-muted'}`}>
                                                            <Check className={`h-3 w-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                                                        </div>
                                                        <div className="flex-1 flex items-center gap-2">
                                                            <span className="text-sm font-medium opacity-90">{feature.name}</span>
                                                            {feature.tooltip && (
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Info className="h-3 w-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{feature.tooltip}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </TooltipProvider>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-8">
                                    <Button
                                        className={`w-full h-12 text-base font-semibold shadow-lg transition-all ${plan.popular
                                            ? 'shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5'
                                            : 'hover:-translate-y-0.5'
                                            }`}
                                        variant={plan.buttonVariant}
                                        size="lg"
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={loadingPlan === plan.id}
                                    >
                                        {loadingPlan === plan.id ? 'Loading...' : plan.buttonText}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center max-w-2xl mx-auto p-6 rounded-2xl bg-muted/30 border border-muted-foreground/10">
                    <h3 className="font-semibold mb-2">Enterprise or Agency?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        We offer custom API access and bulk processing for high-volume needs.
                    </p>
                    <Button variant="link" className="text-primary">Contact Sales &rarr;</Button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
