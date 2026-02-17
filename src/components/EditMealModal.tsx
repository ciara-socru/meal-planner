'use client';

import { useState, useEffect } from 'react';
import { Recipe, MealType } from '@/types';

interface EditMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recipeId?: string, customDescription?: string, isDiningOut?: boolean) => void;
    currentRecipeId?: string;
    currentCustomDescription?: string;
    recipes: Recipe[];
    title: string;
}

export function EditMealModal({
    isOpen,
    onClose,
    onSave,
    currentRecipeId,
    currentCustomDescription,
    recipes,
    title
}: EditMealModalProps) {
    const [mode, setMode] = useState<'recipe' | 'custom' | 'out'>('recipe');
    const [selectedRecipeId, setSelectedRecipeId] = useState(currentRecipeId || '');
    const [customText, setCustomText] = useState(currentCustomDescription || '');

    useEffect(() => {
        if (isOpen) {
            if (currentRecipeId) {
                setMode('recipe');
                setSelectedRecipeId(currentRecipeId);
            } else if (currentCustomDescription) {
                setMode('custom');
                setCustomText(currentCustomDescription);
            } else {
                setMode('recipe');
            }
        }
    }, [isOpen, currentRecipeId, currentCustomDescription]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (mode === 'recipe') {
            onSave(selectedRecipeId || undefined, undefined, false);
        } else if (mode === 'custom') {
            onSave(undefined, customText, false);
        } else {
            onSave(undefined, 'Dining Out', true);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-md rounded-lg shadow-lg border border-border p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Edit {title}</h3>

                <div className="flex space-x-2 rounded-md bg-secondary p-1">
                    {(['recipe', 'custom', 'out'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${mode === m
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {m === 'recipe' ? 'Recipe' : m === 'custom' ? 'Custom' : 'Dining Out'}
                        </button>
                    ))}
                </div>

                <div className="min-h-[100px]">
                    {mode === 'recipe' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Select Recipe</label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={selectedRecipeId}
                                onChange={(e) => setSelectedRecipeId(e.target.value)}
                            >
                                <option value="">-- Select --</option>
                                {recipes.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {mode === 'custom' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Description</label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                placeholder="e.g. Leftovers, Pizza"
                            />
                        </div>
                    )}

                    {mode === 'out' && (
                        <p className="text-sm text-muted-foreground py-4">
                            Mark this meal as "Dining Out". Ingredients won't be added to the shopping list.
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
