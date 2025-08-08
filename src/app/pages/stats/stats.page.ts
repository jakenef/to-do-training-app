import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { NumOfTasksComponent } from "./num-of-tasks/num-of-tasks.component";
import { PercentCompleteTasksComponent } from './percent-complete-tasks/percent-complete-tasks.component';

@Component({
  selector: 'app-stats',
  imports: [MatGridListModule, NumOfTasksComponent, PercentCompleteTasksComponent],
  templateUrl: './stats.page.html',
  styleUrl: './stats.page.scss'
})
export class StatsPage {
  // Empty constructor - keeping it forces proper initialization
  constructor() {}
}
