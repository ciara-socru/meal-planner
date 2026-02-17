'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function RecipeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params as { id: string };
    const { state } = useAppStore();

    const recipe = state.recipes.find((r) => r.id === id);

    if (!recipe) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <h2 className="text-2xl font-bold text-foreground">Recipe not found</h2>
                <p className="mt-2 text-muted-foreground">The recipe you are looking for does not exist.</p>
                <Link
                    href="/recipes"
                    className="mt-4 rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-emerald-600"
                >
                    Back to Recipes
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-6">
                <div>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-4"
                    >
                        ← Back to Recipes
                    </button>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">{recipe.title}</h1>
                    <p className="mt-4 text-xl text-muted-foreground leading-relaxed max-w-2xl">{recipe.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-secondary/50 border border-transparent px-3 py-1 text-sm font-medium text-secondary-foreground"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4 border-y border-border py-6">
                    <div className="text-center md:text-left">
                        <span className="block text-sm font-medium text-muted-foreground uppercase tracking-wider">Prep Time</span>
                        <span className="block text-xl font-medium text-foreground">{recipe.prepTimeMinutes} min</span>
                    </div>
                    <div className="text-center md:text-left">
                        <span className="block text-sm font-medium text-muted-foreground uppercase tracking-wider">Cook Time</span>
                        <span className="block text-xl font-medium text-foreground">{recipe.cookTimeMinutes} min</span>
                    </div>
                    <div className="text-center md:text-left">
                        <span className="block text-sm font-medium text-muted-foreground uppercase tracking-wider">Servings</span>
                        <span className="block text-xl font-medium text-foreground">{recipe.servings} people</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
                <div className="space-y-6">
                    <div className="bg-card rounded-xl p-6 border shadow-sm">
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Ingredients</h2>
                        <ul className="space-y-4">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex justify-between items-baseline text-sm group">
                                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{ingredient.name}</span>
                                    <span className="font-semibold text-foreground whitespace-nowrap ml-4">
                                        {ingredient.quantity} {ingredient.unit}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Instructions</h2>
                    <ol className="space-y-8">
                        {recipe.instructions.map((step, index) => (
                            <li key={index} className="flex gap-4 group">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {index + 1}
                                </span>
                                <p className="mt-1 text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}
