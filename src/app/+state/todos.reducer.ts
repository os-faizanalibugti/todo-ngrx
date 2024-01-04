import { createFeature, createReducer, on } from '@ngrx/store';
import * as TodoActions from './todos.actions';
import { Todo } from '../models/todo';

export const todosFeatureKey = 'todos';

export interface State {
  todos: Todo[];
  currentTab: 'All' | 'Active' | 'Completed';
}

export const initialState: State = {
  todos: [],
  currentTab: 'All',
};

export const reducer = createReducer(
  initialState,
  on(TodoActions.loadTodosSucces, (state, { todos }) => ({
    ...state,
    todos,
  })),
  on(TodoActions.setCurrentTab, (state, { currentTab }) => ({
    ...state,
    currentTab,
  })),
  on(TodoActions.addTodoSucces, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo],
  })),
  on(TodoActions.updateTodoSucces, (state, { updatedTodo }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    ),
  })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== id),
  }))
);

export const todosFeature = createFeature({
  name: todosFeatureKey,
  reducer,
});
