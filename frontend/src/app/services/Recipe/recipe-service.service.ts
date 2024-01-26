import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class RecipeServiceService {
  private baseUrl = 'http://localhost:5454';

  constructor(private http: HttpClient) {}

  recipeSubject = new BehaviorSubject<any>({
    recipes: [],
    loading: false,
    newRecipe: null,
  });

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    });
  }

  getRecipes(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/api/recipes`, { headers }).pipe(
      tap((recipes) => {
        const currentState = this.recipeSubject.value;
        this.recipeSubject.next({ ...currentState, recipes });
      })
    );
  }

  createRecipe(recipe: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http
      .post<any>(`${this.baseUrl}/api/recipes`, recipe, { headers })
      .pipe(
        tap((newRecipe) => {
          const currentState = this.recipeSubject.value;
          this.recipeSubject.next({
            ...currentState,
            recipes: [newRecipe, ...currentState.recipes],
          });
        })
      );
  }

  updateRecipe(recipe: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http
      .put<any>(`${this.baseUrl}/api/recipe/${recipe.id}`, recipe, { headers })
      .pipe(
        tap((updatedRecipe: any) => {
          const currentState = this.recipeSubject.value;
          const updatedRecipes = currentState.recipes.map((item: any) =>
            item.id === updatedRecipe.id ? updatedRecipe : item
          );
          this.recipeSubject.next({ ...currentState, recipes: updatedRecipes });
        })
      );
  }

  likeRecipes(id: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http
      .put<any>(`${this.baseUrl}/api/recipe/${id}/like`, { headers })
      .pipe(
        tap((updatedRecipe: any) => {
          const currentState = this.recipeSubject.value;
          const updatedRecipes = currentState.recipes.map((item: any) =>
            item.id === updatedRecipe.id ? updatedRecipe : item
          );
          this.recipeSubject.next({ ...currentState, recipes: updatedRecipes });
        })
      );
  }

  deleteRecipe(id: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http
      .delete<any>(`${this.baseUrl}/api/recipe/${id}`, { headers })
      .pipe(
        tap((deletedRecipe: any) => {
          const currentState = this.recipeSubject.value;
          const updatedRecipes = currentState.recipes.filter(
            (item: any) => item.id !== id
          );
          this.recipeSubject.next({ ...currentState, recipes: updatedRecipes });
        })
      );
  }
}
