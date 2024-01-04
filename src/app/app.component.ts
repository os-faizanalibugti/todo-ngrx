import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as TodoActions from './+state/todos.actions';
import {
  selectCurrentTab,
  selectItemsLeft,
  selectTodosForCurrentTab,
} from './+state/todos.selectors';
import { Todo } from './models/todo';
import { TodoHttpService } from './services/todo-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  darkMode = false;

  todos$!: Observable<Todo[]>;

  tasksLeft$!: Observable<number>;

  todoInput = '';

  selectedTodo: Todo | null = null;

  CURRENT_TAB$!: Observable<'All' | 'Active' | 'Completed'>;

  tabs = [
    {
      id: '1',
      active: true,
      tab: 'All',
    },
    {
      id: '2',
      active: false,
      tab: 'Active',
    },
    {
      id: '3',
      active: false,
      tab: 'Completed',
    },
  ];

  constructor(
    private todoHttp: TodoHttpService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());

    this.todos$ = this.store.pipe(select(selectTodosForCurrentTab));
    this.tasksLeft$ = this.store.pipe(select(selectItemsLeft));
    this.CURRENT_TAB$ = this.store.pipe(select(selectCurrentTab));
  }

  /**
   * The toggleTheme function switches the darkMode property between true and false.
   */
  toggleTheme() {
    this.darkMode = !this.darkMode;
  }

  /**
   * The submitForm function is used to handle form submission, either
   * updating an existing todo or creating a new one.
   * @param {NgForm} form - The parameter `form` is of type `NgForm`, which is a class representing an
   * Angular form. It is used to access the form's values and state.
   */
  submitForm(todoText: string) {
    if (todoText) {
      if (this.selectedTodo) {
        let updatedTask: Todo = {
          ...this.selectedTodo,
          task: todoText,
        };

        this.store.dispatch(TodoActions.updateTodo({ todo: updatedTask }));
        this.selectedTodo = null;
      } else {
        let createTodo: Todo = {
          task: todoText,
          complete: false,
        };

        this.store.dispatch(TodoActions.addTodo({ todo: createTodo }));
      }
    }
  }

  /**
   * The function toggles the completion status of a todo item and updates it in the database.
   * @param {Todo} todo - The `todo` parameter is an object of type `Todo`.
   */
  toggleComplete(todo: Todo) {
    let updateComplete: Todo = {
      ...todo,
      complete: !todo.complete,
    };

    console.log(updateComplete);

    this.store.dispatch(TodoActions.updateTodo({ todo: updateComplete }));
  }

  /**
   * The deleteTodo function sends a DELETE request to the server to delete a todo item with the
   * specified id, and then reloads the todos.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the
   * todo item that needs to be deleted.
   */
  deleteTodo(id: number) {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  /**
   * The editTodo function sets the selectedTodo and todoInput properties based on the provided todo
   * object.
   * @param {Todo} todo - The `todo` parameter is of type `Todo`, which means it represents an object
   * that has properties related to a specific task or to-do item.
   */
  editTodo(todo: Todo) {
    this.selectedTodo = todo;
    this.todoInput = todo.task;
  }

  /**
   * The function clears all completed todos by filtering and mapping the completed todos and then
   * deleting them.
   */
  clearCompletedTodos() {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  /**
   * The function toggles the active tab by updating the active property of the tab with the specified
   * tabId and setting the ACTIVE_TAB variable to the tab's content.
   * @param {string} tabId - The tabId parameter is a string that represents the unique identifier of
   * the tab that needs to be activated.
   */
  toggleActiveTab(tabId: string) {
    this.tabs = this.tabs.map((tab) => {
      if (tab.id === tabId) {
        // this.CURRENT_TAB = tab.tab;
        this.store.dispatch(
          TodoActions.setCurrentTab({
            currentTab: tab.tab as 'All' | 'Active' | 'Completed',
          })
        );
        tab.active = true;
        return tab;
      } else {
        tab.active = false;
        return tab;
      }
    });
  }

  // Drag & Drop Functionality

  draggedTodoIndex: number | undefined;
  droppedTodoIndex: number | undefined;

  /**
   * The function logs the data attribute "todoid" of the element being dropped and assigns it to the
   * "draggedTodoIndex" variable.
   * @param {any} dropEl - The `dropEl` parameter is the element that was dropped onto. It can be any
   * type of element, such as a div, span, or button.
   */
  droppedOn(dropEl: any) {
    console.log('Drag El', dropEl.srcElement.dataset.todoid);
    this.draggedTodoIndex = +dropEl.srcElement.dataset.todoid;
  }

  /**
   * The function `draggedElement` is used to handle the event when an element is dragged and dropped,
   * and it swaps the positions of two elements in an array.
   * @param {any} dragEl - The parameter `dragEl` is of type `any`, which means it can be any data
   * type.
   */
  draggedElement(dragEl: any) {
    console.log('Dropped On', dragEl.srcElement.parentElement.dataset.todoid);
    this.droppedTodoIndex = +dragEl.srcElement.parentElement.dataset.todoid;
    console.log(this.draggedTodoIndex, this.droppedTodoIndex);
    if (
      (this.draggedTodoIndex || this.draggedTodoIndex === 0) &&
      (this.droppedTodoIndex || this.droppedTodoIndex === 0)
    ) {
      // let tempTodo: Todo = this.todos[this.draggedTodoIndex];
      // this.todos[this.draggedTodoIndex] = this.todos[this.droppedTodoIndex];
      // this.todos[this.droppedTodoIndex] = tempTodo;
      // console.log(this.todos);
    }
  }
}
