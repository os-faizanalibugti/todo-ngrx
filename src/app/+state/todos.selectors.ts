import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodos from './todos.reducer';

export const selectTodosState = createFeatureSelector<fromTodos.State>(
  fromTodos.todosFeatureKey
);

export const selectTodos = createSelector(
  selectTodosState,
  (state) => state.todos
);

export const selectCurrentTab = createSelector(
  selectTodosState,
  (state) => state.currentTab
);

export const selectItemsLeft = createSelector(
  selectTodos,
  (todos) => todos.filter((todo) => !todo.complete).length
);

export const selectTodosForCurrentTab = createSelector(
  selectTodos,
  selectCurrentTab,
  (todos, currentTab) => {
    switch (currentTab) {
      case 'All':
        return todos;
      case 'Active':
        return todos.filter((todo) => !todo.complete);
      case 'Completed':
        return todos.filter((todo) => todo.complete);
      default:
        return todos;
    }
  }
);
