import { MealPlanDay, Recipe, MealType } from '@/types';

// Helper to get formatted date string
function getNext7Days(): string[] {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push(nextDate.toISOString().split('T')[0]);
    }
    return dates;
}

// Simple random shuffler
function shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

export function generateWeeklyPlan(recipes: Recipe[]): MealPlanDay[] {
    const dates = getNext7Days();
    const days: MealPlanDay[] = [];

    // Group recipes by potential meal type (simple heuristic)
    const breakfastRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes('oat') ||
        r.title.toLowerCase().includes('egg') ||
        r.tags.includes('Breakfast' as any)
    );

    const mainRecipes = recipes.filter(r => !breakfastRecipes.includes(r));

    // Fallbacks if no specific recipes found
    const poolBreakfast = breakfastRecipes.length > 0 ? breakfastRecipes : recipes;
    const poolMain = mainRecipes.length > 0 ? mainRecipes : recipes;

    dates.forEach(date => {
        // Pick random recipes for the day
        const dayBreakfast = shuffle(poolBreakfast)[0];
        const dayLunch = shuffle(poolMain)[0];
        const dayDinner = shuffle(poolMain)[1] || dayLunch; // Ensure enough recipes or repeat
        const daySnack = null; // Optional

        days.push({
            date,
            meals: {
                Breakfast: { recipeId: dayBreakfast?.id, attendees: ['Ciara', 'Daniel'] },
                Lunch: { recipeId: dayLunch?.id, attendees: ['Ciara', 'Daniel'] },
                Dinner: { recipeId: dayDinner?.id, attendees: ['Ciara', 'Daniel'] },
                Snack: { recipeId: undefined, customDescription: 'Fruit or Nuts', attendees: ['Ciara', 'Daniel'] }
            }
        });
    });

    return days;
}
