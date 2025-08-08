import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TRPC_CLIENT } from '../../../utils/trpc.client';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-percent-complete-tasks',
  imports: [MatCardModule, NgClass],
  templateUrl: './percent-complete-tasks.component.html',
  styleUrl: './percent-complete-tasks.component.scss'
})
export class PercentCompleteTasksComponent {
  trpc = inject(TRPC_CLIENT);

  isShowingPercentage = signal(false);

  percentTaskResource = trpcResource(this.trpc.tasks.getTasksByUser.mutate, () => ({
    pageOffset: 0,
    pageSize: 1000
  }));

  numOfCompletedTasks = computed(() => {
    const data = this.percentTaskResource.value()?.data;
    return data?.filter(task => task.status === 'Complete').length;
  })

  percentCompletedTasks = computed(() => {
    const data = this.percentTaskResource.value()?.data;
    if (!data) return 0;
    const total = data.length;
    const completed = data.filter(task => task.status === 'Complete').length;
    return Math.round((completed ?? 0) / (total ?? 1) * 100);
  });

  percentClassName = computed(() => {
    const data = this.percentCompletedTasks();
    if (!data) return '';
    if (data < 25){
      return 'red'
    } else if (data < 75) {
      return 'yellow'
    } else {
      return 'green'
    }
  })

  constructor() {
    this.percentTaskResource.refresh();
  }
}
