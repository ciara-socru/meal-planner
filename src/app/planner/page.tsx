'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { EditMealModal } from '@/components/EditMealModal';
import { MealType } from '@/types';

export default function PlannerPage() {
    const { state, generatePlan, updateMealPlan } = useAppStore();
    const { mealPlan, recipes } = state;

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingDayDate, setEditingDayDate] = useState<string | null>(null);
    const [editingMealType, setEditingMealType] = useState<MealType | null>(null);

    const getRecipe = (id?: string) => recipes.find((r) => r.id === id);

    const handleEditClick = (date: string, type: MealType) => {
        setEditingDayDate(date);
        setEditingMealType(type);
        setEditModalOpen(true);
    };

    const handleSaveMeal = (recipeId?: string, customDescription?: string, isDiningOut?: boolean) => {
        if (!editingDayDate || !editingMealType) return;

        const newPlan = mealPlan.map((day) => {
            if (day.date === editingDayDate) {
                return {
                    ...day,
                    meals: {
                        ...day.meals,
                        [editingMealType]: {
                            recipeId,
                            customDescription,
                            isDiningOut,
                            attendees: ['Ciara', 'Daniel'], // Default for now
                        },
                    },
                };
            }
            return day;
        });

        updateMealPlan(newPlan);
        setEditModalOpen(false);
    };

    const getMealDisplay = (day: any, type: MealType) => {
        const meal = day.meals[type];
        if (!meal) return <span className="text-sm text-muted-foreground italic">No meal planned</span>;

        if (meal.isDiningOut || meal.customDescription === 'Dining Out') {
            return <span className="text-sm font-medium text-primary">Dining Out 🍽️</span>;
        }

        if (meal.recipeId) {
            const r = getRecipe(meal.recipeId);
            return (
                <Link href={`/recipes/${meal.recipeId}`} className="text-sm font-medium text-foreground hover:underline hover:text-primary">
                    {r?.title || 'Unknown Recipe'}
                </Link>
            );
        }

        if (meal.customDescription) {
            return <span className="text-sm text-foreground">{meal.customDescription}</span>;
        }

        return <span className="text-sm text-muted-foreground italic">No meal planned</span>;
    };

    if (!mealPlan || mealPlan.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Weekly Planner</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    You don't have a meal plan for this week yet.
                </p>
                <button
                    onClick={generatePlan}
                    className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Generate Weekly Plan
                </button>
            </div>
        );
    }

    const currentDay = mealPlan.find(d => d.date === editingDayDate);
    const currentMeal = currentDay?.meals[editingMealType as MealType];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Weekly Planner</h1>
                <button
                    onClick={generatePlan}
                    className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                    Regenerate Plan
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {mealPlan.map((day) => {
                    const dateObj = new Date(day.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                        <div key={day.date} className="bg-card shadow-sm rounded-xl border border-border p-6 transition-all hover:shadow-md">
                            <h2 className="text-xl font-serif font-bold text-foreground mb-4 border-b border-border/50 pb-2 flex items-baseline gap-2">
                                {dayName} <span className="text-sm font-sans font-medium text-muted-foreground">{formattedDate}</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map((type) => (
                                    <div
                                        key={type}
                                        className="bg-secondary/30 rounded-lg p-4 cursor-pointer hover:bg-secondary/60 transition-colors group relative border border-transparent hover:border-border"
                                        onClick={() => handleEditClick(day.date, type)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{type}</span>
                                            <span className="opacity-0 group-hover:opacity-100 text-xs text-primary font-bold">Edit</span>
                                        </div>
                                        <div className="min-h-[3rem] flex items-center">
                                            {getMealDisplay(day, type)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <EditMealModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSaveMeal}
                title={`${editingMealType} for ${new Date(editingDayDate || '').toLocaleDateString('en-US', { weekday: 'long' })}`}
                recipes={recipes}
                currentRecipeId={currentMeal?.recipeId}
                currentCustomDescription={currentMeal?.customDescription}
            />
        </div>
    );
}
