import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  totalRecipesChanged = new Subject<number>(); // For pagination total recipes

  private recipes: Recipe[] = [];
  private pageSize: number = 5;

  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.getPaginatedRecipes(1)); // Initialize with the first page
    this.totalRecipesChanged.next(this.recipes.length);
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getPaginatedRecipes(page: number): Recipe[] {
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.recipes.slice(startIndex, endIndex);
  }

  searchRecipes(query: string, page: number): Recipe[] {
    const filteredRecipes = this.recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(query.toLowerCase())
    );
    this.totalRecipesChanged.next(filteredRecipes.length); // Update total for pagination
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filteredRecipes.slice(startIndex, endIndex);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getPaginatedRecipes(1)); // Reset to first page
    this.totalRecipesChanged.next(this.recipes.length); // Update total recipes
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.getPaginatedRecipes(1)); // Reset to first page
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.getPaginatedRecipes(1)); // Reset to first page
    this.totalRecipesChanged.next(this.recipes.length); // Update total recipes
  }
}
