'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, MealPlanDay, PantryItem, Recipe } from '@/types';
import { MOCK_RECIPES } from '@/data/mock-recipes';
import { generateWeeklyPlan } from '@/lib/planner';

const STORAGE_KEY = 'meal-planner-state';

const INITIAL_STATE: AppState = {
    recipes: MOCK_RECIPES,
    pantry: [],
    mealPlan: [],
    preferences: {
        users: ['Ciara', 'Daniel'],
        dietaryRestrictions: [],
    },
};

interface AppContextType {
    state: AppState;
    addRecipe: (recipe: Recipe) => void;
    deleteRecipe: (id: string) => void;
    updatePantryItem: (item: PantryItem) => void;
    removePantryItem: (id: string) => void;
    updateMealPlan: (plan: MealPlanDay[]) => void;
    generatePlan: () => void;
    resetStore: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AppState>(INITIAL_STATE);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with initial structure to ensure new fields are present
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setState((prev) => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Failed to parse state from local storage', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state, isInitialized]);

    const addRecipe = (recipe: Recipe) => {
        setState((prev) => ({
            ...prev,
            recipes: [...prev.recipes, recipe],
        }));
    };

    const deleteRecipe = (id: string) => {
        setState((prev) => ({
            ...prev,
            recipes: prev.recipes.filter((recipe) => recipe.id !== id),
        }));
    };

    const updatePantryItem = (item: PantryItem) => {
        setState((prev) => {
            const existingIndex = prev.pantry.findIndex((p) => p.id === item.id);
            let newPantry;
            if (existingIndex >= 0) {
                newPantry = [...prev.pantry];
                newPantry[existingIndex] = item;
            } else {
                newPantry = [...prev.pantry, item];
            }
            return { ...prev, pantry: newPantry };
        });
    };

    const removePantryItem = (id: string) => {
        setState((prev) => ({
            ...prev,
            pantry: prev.pantry.filter((item) => item.id !== id),
        }));
    };

    const updateMealPlan = (plan: MealPlanDay[]) => {
        setState((prev) => ({ ...prev, mealPlan: plan }));
    };

    const generatePlan = () => {
        const newPlan = generateWeeklyPlan(state.recipes);
        setState((prev) => ({ ...prev, mealPlan: newPlan }));
    };

    const resetStore = () => {
        setState(INITIAL_STATE);
        localStorage.removeItem(STORAGE_KEY);
    };

    if (!isInitialized) {
        return null; // Or a loading spinner
    }

    return (
        <AppContext.Provider
            value={{
                state,
                addRecipe,
                deleteRecipe,
                updatePantryItem,
                removePantryItem,
                updateMealPlan,
                generatePlan,
                resetStore,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppStore() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppStore must be used within an AppProvider');
    }
    return context;
}
