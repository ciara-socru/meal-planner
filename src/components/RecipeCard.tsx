import Link from 'next/link';
import { Recipe } from '@/types';
import { useAppStore } from '@/lib/store';

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    const { deleteRecipe } = useAppStore();

    // Separate delete handler to prevent event bubbling
    const handleDelete = (e: React.MouseEvent) => {
        // Stop both propagation and default browser behavior (navigation)
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
            // Small timeout to ensure event clearing, though usually not strictly necessary if e.stopPropagation works
            deleteRecipe(recipe.id);
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="aspect-h-1 aspect-w-1 h-48 w-full overflow-hidden bg-muted sm:h-56 relative">
                {/* Image Placeholder */}
                <div className="flex h-full w-full items-center justify-center bg-secondary/30 text-muted-foreground">
                    <span className="text-4xl">🥘</span>
                </div>

                {/* Meal Types Badge */}
                {recipe.mealTypes && recipe.mealTypes.length > 0 && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        {recipe.mealTypes.map(type => (
                            <span key={type} className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                                {type}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/recipes/${recipe.id}`} className="focus:outline-none">
                            <span aria-hidden="true" className="absolute inset-0" />
                            {recipe.title}
                        </Link>
                    </h3>
                </div>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed h-[2.5rem]">
                    {recipe.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {recipe.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground border border-transparent group-hover:border-primary/20 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                    {recipe.tags.length > 3 && (
                        <span className="inline-flex items-center rounded-md bg-secondary/30 px-2 py-1 text-xs text-muted-foreground">
                            +{recipe.tags.length - 3}
                        </span>
                    )}
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-muted-foreground border-t border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <span>⏱️</span>
                            <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>🍽️</span>
                            <span>{recipe.servings} pp</span>
                        </div>
                    </div>

                    {/* Delete Button - z-index ensures it sits above the Link's absolute inset */}
                    <button
                        onClick={handleDelete}
                        className="relative z-10 p-1.5 -mr-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-destructive"
                        title="Delete Recipe"
                        aria-label={`Delete ${recipe.title}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
