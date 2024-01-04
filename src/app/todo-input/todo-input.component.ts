import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrl: './todo-input.component.scss',
})
export class TodoInputComponent {
  @Input() todoInput!: string;
  @Output() formValue = new EventEmitter();

  submitForm(form: NgForm) {
    this.formValue.emit(form.value.todo);

    form.reset()
  }
}
