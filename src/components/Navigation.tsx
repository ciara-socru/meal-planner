'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Pantry', href: '/pantry' },
    { name: 'Planner', href: '/planner' },
    { name: 'Shopping List', href: '/shopping-list' },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-serif font-bold text-primary tracking-tight">MealPlanner</span>
                        </Link>
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
