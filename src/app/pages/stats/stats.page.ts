import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { NumOfTasksComponent } from "./num-of-tasks/num-of-tasks.component";

@Component({
  selector: 'app-stats',
  imports: [MatGridListModule, NumOfTasksComponent],
  templateUrl: './stats.page.html',
  styleUrl: './stats.page.scss'
})
export class StatsPage {
  // Empty constructor - keeping it forces proper initialization
  constructor() {}
}
