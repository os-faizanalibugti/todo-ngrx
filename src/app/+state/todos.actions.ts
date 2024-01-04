import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo';

export const setCurrentTab = createAction(
  '[Todos] Set Current Tab',
  props<{ currentTab: 'All' | 'Active' | 'Completed' }>()
);

export const loadTodos = createAction('[Todos] Load Todos');

export const loadTodosSucces = createAction(
  '[Todos/API] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const loadTodosFailure = createAction(
  '[Todos/API] Load Todos Failure',
  props<{ error: any }>()
);

export const addTodo = createAction(
  '[Todos] Add Todo',
  props<{ todo: Todo }>()
);

export const addTodoSucces = createAction(
  '[Todos/API] Add Todo Success',
  props<{ todo: Todo }>()
);

export const addTodoFailure = createAction(
  '[Todos/API] Add Todo Failure',
  props<{ error: any }>()
);

export const updateTodo = createAction(
  '[Todos] Update Todo',
  props<{ todo: Todo }>()
);

export const updateTodoSucces = createAction(
  '[Todos/API] Update Todo Success',
  props<{ updatedTodo: Todo }>()
);

export const updateTodoFailure = createAction(
  '[Todos/API] Update Todo Failure',
  props<{ error: any }>()
);

export const deleteTodo = createAction(
  '[Todos] Delete Todo',
  props<{ id: number }>()
);

export const deleteTodoSuccess = createAction(
  '[Todos/API] Delete Todo Success',
  props<{ id: number }>()
);

export const deleteTodoFailure = createAction(
  '[Todos/API] Delete Todo Failure',
  props<{ error: any }>()
);


export const clearCompleted = createAction('[Todos] Clear Completed');