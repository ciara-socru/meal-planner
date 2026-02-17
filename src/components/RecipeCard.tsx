import Link from 'next/link';
import { Recipe } from '@/types';
import { useAppStore } from '@/lib/store';

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    const { deleteRecipe } = useAppStore();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this recipe?')) {
            deleteRecipe(recipe.id);
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="aspect-h-1 aspect-w-1 h-48 w-full overflow-hidden bg-muted sm:h-56">
                {/* Placeholder for image */}
                <div className="flex h-full w-full items-center justify-center bg-secondary/30 text-muted-foreground">
                    <span className="text-4xl">🥘</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/recipes/${recipe.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {recipe.title}
                    </Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
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
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-muted-foreground border-t border-border/50">
                    <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>{recipe.servings} servings</span>
                        <button
                            onClick={handleDelete}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            title="Delete Recipe"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}
