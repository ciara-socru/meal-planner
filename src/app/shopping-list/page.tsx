'use client';

import { useAppStore } from '@/lib/store';
import { generateShoppingList } from '@/lib/shopping-list';
import { useMemo, useState } from 'react';

export default function ShoppingListPage() {
    const { state } = useAppStore();
    const { mealPlan, recipes, pantry } = state;

    const [checkedNames, setCheckedNames] = useState<Set<string>>(new Set());

    const items = useMemo(() => {
        if (mealPlan.length > 0) {
            return generateShoppingList(mealPlan, recipes, pantry);
        }
        return [];
    }, [mealPlan, recipes, pantry]);

    const handlePrint = () => {
        window.print();
    };

    const toggleItem = (name: string) => {
        setCheckedNames((prev) => {
            const next = new Set(prev);
            if (next.has(name)) {
                next.delete(name);
            } else {
                next.add(name);
            }
            return next;
        });
    };

    if (!mealPlan || mealPlan.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Shopping List</h1>
                <p className="text-muted-foreground text-center">
                    No meal plan found. Generate a plan to see your shopping list.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto print:max-w-none">
            <div className="flex items-center justify-between print:hidden border-b pb-4">
                <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Shopping List</h1>
                <button
                    onClick={handlePrint}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    Print / Save PDF
                </button>
            </div>

            <div className="bg-card shadow-sm rounded-xl border border-border overflow-hidden print:shadow-none print:border-none">
                <div className="p-8">
                    <div className="text-center mb-8 border-b border-border/50 pb-6 print:block hidden">
                        <h2 className="text-2xl font-serif font-bold">Weekly Shop</h2>
                        <p className="text-sm text-muted-foreground">Generated for Ciara & Daniel</p>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6 print:hidden">
                        Based on your meal plan and current pantry stock.
                    </p>
                    <ul className="divide-y divide-border">
                        {items.length === 0 ? (
                            <li className="py-8 text-center text-muted-foreground italic">Nothing to buy! You have everything you need.</li>
                        ) : (
                            items.map((item, idx) => {
                                const isChecked = checkedNames.has(item.name);
                                return (
                                    <li key={idx} className="flex items-center py-4 group">
                                        <input
                                            id={`item-${idx}`}
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleItem(item.name)}
                                            className="h-5 w-5 rounded border-input text-primary focus:ring-primary print:hidden transition-transform active:scale-95"
                                        />
                                        <label
                                            htmlFor={`item-${idx}`}
                                            className={`ml-4 text-sm font-medium text-foreground flex-1 cursor-pointer select-none transition-colors ${isChecked ? 'line-through text-muted-foreground' : 'group-hover:text-primary'}`}
                                        >
                                            {item.name}
                                        </label>
                                        <span className={`text-sm font-semibold transition-colors ${isChecked ? 'text-muted-foreground' : 'text-foreground'}`}>
                                            {Math.ceil(parseFloat(item.quantity) * 10) / 10} {item.unit}
                                        </span>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
