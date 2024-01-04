import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoHttpService {
  BASE_URL = 'http://localhost:3000';
  model = 'todos';

  // http://localhost:3000/todos
  private getUrl() {
    return `${this.BASE_URL}/${this.model}`;
  }

  // http://localhost:3000/todos/:id
  private getUrlWithID(id: string | number) {
    return `${this.getUrl()}/${id}`;
  }

  constructor(private http: HttpClient) {}

  getAllTodos() {
    return this.http.get<Todo[]>(this.getUrl());
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.getUrl(), todo);
  }

  // localhost:3000/todos/{{todo.id}}
  updateTodo(todo: Todo) {
    if (todo.id) {
      return this.http.put<Todo>(this.getUrlWithID(todo.id), todo);
    } else {
      return of(todo)
    }
  }

  deleteTodo(id: string | number) {
    return this.http.delete(this.getUrlWithID(id));
  }
}
