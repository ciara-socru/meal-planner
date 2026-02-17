'use client';

import { useAppStore } from '@/lib/store';
import { RecipeCard } from '@/components/RecipeCard';
import { AddRecipeModal } from '@/components/AddRecipeModal';
import { useState } from 'react';

export default function RecipesPage() {
    const { state, addRecipe } = useAppStore();
    const { recipes } = state;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Recipes</h1>
                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    Add Recipe
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

            {recipes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No recipes found. Add some to get started!</p>
                </div>
            )}

            <AddRecipeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={addRecipe}
            />
        </div>
    );
}
