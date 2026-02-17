'use client';

import { useState } from 'react';
import { Ingredient, Recipe, DietaryRestriction, Unit } from '@/types';

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

    // Simple ingredients input for MVP (just one text area to parse, or properly structured?)
    // Let's do structured but simple.
    const [ingredientsText, setIngredientsText] = useState('');
    const [instructionsText, setInstructionsText] = useState('');
    const [tags, setTags] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Naive parsing for MVP
        const ingredients: Ingredient[] = ingredientsText.split('\n').filter(line => line.trim()).map(line => {
            // Expected format: "1 cup Rice" or "Quantity Unit Name"
            const parts = line.split(' ');
            const quantity = parseFloat(parts[0]) || 1;
            const unit = (parts[1] || 'piece') as Unit;
            const name = parts.slice(2).join(' ') || parts.slice(1).join(' ') || line;
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
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-card w-full max-w-2xl rounded-lg shadow-lg border border-border p-6 space-y-4 my-8">
                <h3 className="text-2xl font-semibold text-foreground">Add New Recipe</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground">Title</label>
                        <input
                            required
                            className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm border"
                            value={title} onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground">Description</label>
                        <input
                            className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm border"
                            value={description} onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground">Prep Time (min)</label>
                            <input type="number" className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm border"
                                value={prepTime} onChange={e => setPrepTime(parseInt(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground">Cook Time (min)</label>
                            <input type="number" className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm border"
                                value={cookTime} onChange={e => setCookTime(parseInt(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground">Servings</label>
                            <input type="number" className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm border"
                                value={servings} onChange={e => setServings(parseInt(e.target.value))} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground">Tags (comma separated)</label>
                        <input
                            className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm border"
                            value={tags} onChange={e => setTags(e.target.value)}
                            placeholder="Vegetarian, Healthy, Quick"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground">
                            Ingredients (One per line: "Quantity Unit Name", e.g. "1 cup Rice")
                        </label>
                        <textarea
                            rows={5}
                            className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm border"
                            value={ingredientsText} onChange={e => setIngredientsText(e.target.value)}
                            placeholder="1 cup Rice&#10;2 piece Chicken Breast"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground">Instructions (One per line)</label>
                        <textarea
                            rows={5}
                            className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm border"
                            value={instructionsText} onChange={e => setInstructionsText(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Save Recipe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
