'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { PantryItem, Unit } from '@/types';

export default function PantryPage() {
    const { state, updatePantryItem, removePantryItem } = useAppStore();
    const { pantry } = state;

    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    const [newItemUnit, setNewItemUnit] = useState<Unit>('piece');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName) return;

        const newItem: PantryItem = {
            id: Date.now().toString(), // Simple ID generation
            name: newItemName,
            quantity: newItemQuantity,
            unit: newItemUnit,
        };

        updatePantryItem(newItem);
        setNewItemName('');
        setNewItemQuantity(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Pantry</h1>
            </div>

            <div className="bg-card shadow-sm rounded-lg border border-border p-6">
                <h2 className="text-lg font-medium text-foreground mb-4">Add New Item</h2>
                <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                            Item Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="e.g., Rice"
                        />
                    </div>
                    <div className="w-full sm:w-24">
                        <label htmlFor="quantity" className="block text-sm font-medium text-muted-foreground">
                            Quantity
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            min="0"
                            step="0.1"
                            value={newItemQuantity}
                            onChange={(e) => setNewItemQuantity(parseFloat(e.target.value))}
                            className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                    </div>
                    <div className="w-full sm:w-32">
                        <label htmlFor="unit" className="block text-sm font-medium text-muted-foreground">
                            Unit
                        </label>
                        <select
                            id="unit"
                            name="unit"
                            value={newItemUnit}
                            onChange={(e) => setNewItemUnit(e.target.value as Unit)}
                            className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        >
                            <option value="piece">piece</option>
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                            <option value="cup">cup</option>
                            <option value="tbsp">tbsp</option>
                            <option value="tsp">tsp</option>
                            <option value="pack">pack</option>
                            <option value="can">can</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add
                    </button>
                </form>
            </div>

            <div className="bg-card shadow-sm rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-foreground">Current Stock</h3>
                </div>
                <ul role="list" className="divide-y divide-border">
                    {pantry.length === 0 ? (
                        <li className="px-4 py-4 sm:px-6 text-center text-muted-foreground">
                            Your pantry is empty.
                        </li>
                    ) : (
                        pantry.map((item) => (
                            <li key={item.id} className="flex items-center justify-between px-4 py-4 sm:px-6 hover:bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-foreground">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.quantity} {item.unit}
                                    </div>
                                </div>
                                <button
                                    onClick={() => removePantryItem(item.id)}
                                    className="text-sm font-medium text-destructive hover:text-destructive/80"
                                >
                                    Remove
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
