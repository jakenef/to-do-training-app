import { Component, effect, inject, input, linkedSignal, output, signal } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TRPC_CLIENT } from '../../../utils/trpc.client';
import { TaskStatus } from '../../../enums/task-status';

type Task = { 
  status: TaskStatus;
  id: string; 
  createdAt: Date; 
  updatedAt: Date; 
  title: string; 
  description: string | null; 
  completedDate: Date | null; 
  ownerId: string; 
}

@Component({
  selector: 'app-task-card',
  imports: [MatIconModule, MatCardModule, MatButtonModule, MatInputModule, MatFormField, FormsModule, DatePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  trpc = inject(TRPC_CLIENT);

  initialTaskValue = input.required<Task>();
  deleteTaskEvent = output<string>();

  taskCardState = trpcResource(this.trpc.tasks.updateTask.mutate, () => ({
    taskId: this.initialTaskValue().id,
    // taskId: '-1', // test error responses
    newTitle: this.newTitle(),
    newDescription: this.newDescription(),
    newStatus: this.newStatus(),
  }), { valueComputation: () => this.initialTaskValue() });

  newTitle = signal('');
  newDescription = signal('');
  newStatus = signal<TaskStatus>('Incomplete');

  constructor() {
    effect(() => {
      const state = this.taskCardState.value()
      if (state) {
        this.newTitle.set(state.title)
        this.newDescription.set(state.description ?? '')
        this.newStatus.set(state.status)
      }
    })
  }

  editMode = linkedSignal<boolean>(() => !!this.taskCardState.error());

  update(updates: Partial<Task>) {
    this.taskCardState.value.update((prevTask) => {
      if (prevTask === undefined) return undefined
      return { ...prevTask, ...updates }
    })
    this.taskCardState.refresh();
  }

  save() {
    this.update({title: this.newTitle(), description: this.newDescription()});
    this.toggleEditMode();
  }

  cancel() {
    this.newTitle.set(this.taskCardState.value()?.title ?? '')
    this.newDescription.set(this.taskCardState.value()?.description ?? '')
    this.toggleEditMode();
  }

  toggleEditMode() {
    this.editMode.update(prev => !prev)
  }

  deleteTask() {
    this.deleteTaskEvent.emit(this.initialTaskValue().id);
  }
}