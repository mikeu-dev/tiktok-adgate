'use client';

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Users, Download, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock data
const STATS = [
    { label: 'Total Users', value: '1,234', icon: Users, change: '+12%' },
    { label: 'Total Downloads', value: '54,321', icon: Download, change: '+25%' },
    { label: 'Revenue', value: '$12,345', icon: DollarSign, change: '+15%' },
    { label: 'Active Sessions', value: '567', icon: BarChart, change: '+5%' },
];

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/');
            } else {
                // In a real app, you'd check a claim or DB role. 
                // For now, we'll just allow it for demo purposes or check a hardcoded email
                // Check for specific admin email from env
                const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
                if (user.email === adminEmail) {
                    setIsAdmin(true);
                } else {
                    router.push('/');
                }
            }
        }
    }, [user, loading, router]);

    if (loading || !isAdmin) {
        return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>;
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8 md:py-12 min-h-screen">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {STATS.map((stat, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.change} from last month
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">User activity log will appear here.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline">Manage Plans</Button>
                    </CardContent>
                </Card>

            </main>
            <Footer />
        </>
    );
}
