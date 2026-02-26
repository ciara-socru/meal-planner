import { Recipe, PantryItem, Ingredient, MealPlanDay, Unit } from '@/types';

interface ShoppingListItem extends Ingredient {
    checked: boolean;
}

export function generateShoppingList(
    plan: MealPlanDay[],
    recipes: Recipe[],
    pantry: PantryItem[]
): ShoppingListItem[] {
    const needed: { [key: string]: { quantity: number; unit: string } } = {};

    // 1. Aggregate ingredients from plan
    plan.forEach(day => {
        Object.values(day.meals).forEach(meal => {
            if (meal && meal.recipeId && !meal.isDiningOut) {
                const recipe = recipes.find(r => r.id === meal.recipeId);
                if (recipe) {
                    recipe.ingredients.forEach(ing => {
                        const key = ing.name.toLowerCase();
                        if (!needed[key]) {
                            needed[key] = { quantity: 0, unit: ing.unit };
                        }
                        const q = parseFloat(ing.quantity);
                        needed[key].quantity += isNaN(q) ? 0 : q;
                    });
                }
            }
        });
    });

    // 2. Subtract pantry items (Simple matching by name)
    pantry.forEach(item => {
        const key = item.name.toLowerCase();
        if (needed[key]) {
            needed[key].quantity -= item.quantity;
            if (needed[key].quantity <= 0) {
                delete needed[key];
            }
        }
    });

    // 3. Convert to list
    return Object.entries(needed).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        quantity: data.quantity.toString(), // Convert back to string for UI
        unit: data.unit as Unit,
        checked: false
    }));
}
