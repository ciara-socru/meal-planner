'use client';

import { useState } from 'react';
import { Ingredient, Recipe, Unit, MealType } from '@/types';

interface AddRecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recipe: Recipe) => void;
}

export function AddRecipeModal({ isOpen, onClose, onSave }: AddRecipeModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prepTime, setPrepTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [servings, setServings] = useState(2);

    const [ingredientsText, setIngredientsText] = useState('');
    const [instructionsText, setInstructionsText] = useState('');
    const [tags, setTags] = useState('');
    const [mealTypes, setMealTypes] = useState<MealType[]>([]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const ingredients: Ingredient[] = ingredientsText.split('\n').filter(line => line.trim()).map(line => {
            // Expected format: "1 cup Rice" or "Quantity Unit Name".
            // If the first part is NOT a number, treat whole line as loose format like "Handful of herbs"
            const parts = line.split(' ');
            const quantityVal = parseFloat(parts[0]);

            let quantity = parts[0];
            let unit: Unit = 'piece';
            let name = '';

            if (!isNaN(quantityVal)) {
                // Standard format: "1 cup Rice"
                quantity = parts[0];
                unit = (parts[1] || 'piece') as Unit;
                name = parts.slice(2).join(' ') || parts.slice(1).join(' ') || line;
            } else {
                // Loose format: "Handful of herbs" -> quantity="Handful", unit="piece", name="of herbs" (imperfect but functional)
                // Better: quantity="1", unit="piece", name=line. Or just treat quantity as "1" and name as line?
                // The requirement was "flexible quantities". 
                // Let's try to extract patterns, or just default to:
                quantity = ''; // No quantity specified
                unit = 'piece';
                name = line;
            }

            // Re-evaluating based on "1 cup Rice" vs "1/2 cup Rice" vs "Salt to taste"
            // Simple approach: if starts with number, parse. If not, put generic quantity.
            if (/^\d/.test(line)) {
                quantity = parts[0];
                unit = (parts[1] || 'piece') as Unit;
                name = parts.slice(2).join(' ');
            } else {
                quantity = '-'; // distinct from number
                unit = 'piece';
                name = line;
            }

            return { name, quantity, unit };
        });

        const instructions = instructionsText.split('\n').filter(line => line.trim());

        const newRecipe: Recipe = {
            id: Date.now().toString(),
            title,
            description,
            ingredients,
            instructions,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            mealTypes,
            prepTimeMinutes: prepTime,
            cookTimeMinutes: cookTime,
            servings,
        };

        onSave(newRecipe);
        onClose();

        // Reset form
        setTitle('');
        setDescription('');
        setIngredientsText('');
        setInstructionsText('');
        setTags('');
        setMealTypes([]);
    };

    const toggleMealType = (type: MealType) => {
        setMealTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border p-8 space-y-6 my-8 text-card-foreground">
                <div className="flex justify-between items-start">
                    <h3 className="text-3xl font-serif font-bold text-foreground">Add New Recipe</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <span className="sr-only">Close</span>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1">Title</label>
                                <input
                                    required
                                    className="w-full rounded-lg border-input bg-background/50 py-2.5 px-4 text-foreground shadow-sm border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    placeholder="Recipe Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-lg border-input bg-background/50 py-2.5 px-4 text-foreground shadow-sm border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    value={description} onChange={e => setDescription(e.target.value)}
                                    placeholder="Brief description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Meal Types</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleMealType(type)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${mealTypes.includes(type)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Prep</label>
                                    <input type="number" className="w-full rounded-lg border-input bg-background/50 py-2 px-3 text-foreground shadow-sm border focus:ring-2 focus:ring-primary"
                                        value={prepTime} onChange={e => setPrepTime(parseInt(e.target.value))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cook</label>
                                    <input type="number" className="w-full rounded-lg border-input bg-background/50 py-2 px-3 text-foreground shadow-sm border focus:ring-2 focus:ring-primary"
                                        value={cookTime} onChange={e => setCookTime(parseInt(e.target.value))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Servings</label>
                                    <input type="number" className="w-full rounded-lg border-input bg-background/50 py-2 px-3 text-foreground shadow-sm border focus:ring-2 focus:ring-primary"
                                        value={servings} onChange={e => setServings(parseInt(e.target.value))} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1">Tags</label>
                                <input
                                    className="w-full rounded-lg border-input bg-background/50 py-2 px-4 text-foreground shadow-sm border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    value={tags} onChange={e => setTags(e.target.value)}
                                    placeholder="Vegetarian, Healthy, Quick"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">
                                Ingredients <span className="text-xs font-normal text-muted-foreground">(Qty Unit Name)</span>
                            </label>
                            <textarea
                                rows={6}
                                className="w-full rounded-lg border-input bg-background/50 py-2.5 px-4 text-foreground shadow-sm border focus:ring-2 focus:ring-primary focus:border-primary transition-all font-mono text-sm"
                                value={ingredientsText} onChange={e => setIngredientsText(e.target.value)}
                                placeholder={'1 cup Rice\n2 piece Chicken Breast\nSalt to taste'}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Instructions</label>
                            <textarea
                                rows={6}
                                className="w-full rounded-lg border-input bg-background/50 py-2.5 px-4 text-foreground shadow-sm border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                value={instructionsText} onChange={e => setInstructionsText(e.target.value)}
                                placeholder={'1. Wash rice.\n2. Cook chicken.'}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-input bg-background px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
                        >
                            Save Recipe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
