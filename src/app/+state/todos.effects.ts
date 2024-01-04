import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of, tap } from 'rxjs';
import * as TodoActions from './todos.actions';
import { TodoHttpService } from '../services/todo-http.service';
import { Store, select } from '@ngrx/store';
import { selectTodos } from './todos.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TodosEffects {
  constructor(
    private actions$: Actions,
    private todoHttp: TodoHttpService,
    private readonly store: Store,
    private snackbar: MatSnackBar
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      concatMap(() =>
        this.todoHttp.getAllTodos().pipe(
          map((todos) => TodoActions.loadTodosSucces({ todos })),
          catchError((error) => of(TodoActions.loadTodosFailure({ error })))
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      concatMap(({ todo }) =>
        this.todoHttp.createTodo(todo).pipe(
          map((todo) => TodoActions.addTodoSucces({ todo })),
          catchError((error) => of(TodoActions.addTodoFailure({ error })))
        )
      )
    )
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe( 
      ofType(TodoActions.updateTodo),
      concatMap(({ type, todo }) =>
        this.todoHttp.updateTodo(todo).pipe(
          map((todo) => TodoActions.updateTodoSucces({ updatedTodo: todo })),
          catchError((error) => of(TodoActions.updateTodoFailure({ error })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      concatMap(({ id }) =>
        this.todoHttp.deleteTodo(id).pipe(
          map(() => TodoActions.deleteTodoSuccess({ id })),
          catchError((error) => of(TodoActions.deleteTodoFailure({ error })))
        )
      )
    )
  );

  clearCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.clearCompleted),
      concatLatestFrom(() => [this.store.pipe(select(selectTodos))]),
      concatMap(([{}, todos]) =>
        todos
          .filter((todo) => todo.complete)
          .map((todo) => TodoActions.deleteTodo({ id: todo.id as number }))
      )
    )
  );

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.loadTodosFailure,
          TodoActions.addTodoFailure,
          TodoActions.deleteTodoFailure,
          TodoActions.updateTodoFailure
        ),
        tap(() =>
          this.snackbar.open(
            'Something went wrong. Please try again later.',
            'Error'
          )
        )
      ),
    { dispatch: false }
  );
}
