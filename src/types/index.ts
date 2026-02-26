export type DietaryRestriction = 'Gluten-Free' | 'Dairy-Free' | 'Vegetarian' | 'Vegan' | 'Nut-Free' | 'Low-Carb';

export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'cup' | 'tbsp' | 'tsp' | 'piece' | 'pack' | 'can';

export interface Ingredient {
    name: string;
    quantity: string; // Changed to string to support "to taste", "thumb-sized", etc.
    unit: Unit;
}

export interface Recipe {
    id: string;
    title: string;
    description?: string;
    ingredients: Ingredient[];
    instructions: string[];
    tags: string[];
    mealTypes: MealType[]; // Added to classify recipes
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    image?: string;
}

export interface PantryItem {
    id: string;
    name: string;
    quantity: number;
    unit: Unit;
    expiryDate?: string; // ISO date string
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MealPlanDay {
    date: string; // ISO date string: YYYY-MM-DD
    meals: {
        [key in MealType]?: {
            recipeId?: string; // If null/undefined, could be empty or Dining Out?
            customDescription?: string; // For manual overrides or "Dining Out"
            isDiningOut?: boolean;
            attendees: string[]; // ['Ciara', 'Daniel']
        };
    };
    events?: string[]; // "Gym", "Late meeting" - affects planning
}

// Global App State Interface
export interface AppState {
    recipes: Recipe[];
    pantry: PantryItem[];
    mealPlan: MealPlanDay[];
    preferences: {
        users: string[];
        dietaryRestrictions: DietaryRestriction[];
    };
}
