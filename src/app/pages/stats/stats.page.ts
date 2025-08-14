import { Component, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { NumOfTasksComponent } from "./num-of-tasks/num-of-tasks.component";
import { PercentCompleteTasksComponent } from './percent-complete-tasks/percent-complete-tasks.component';
import { HelpPopupComponent } from "./help-popup/help-popup.component";

@Component({
  selector: 'app-stats',
  imports: [MatGridListModule, NumOfTasksComponent, PercentCompleteTasksComponent, HelpPopupComponent],
  templateUrl: './stats.page.html',
  styleUrl: './stats.page.scss'
})
export class StatsPage {
  // Empty constructor - keeping it forces proper initialization
  constructor() {}

  isShowingHelp = signal(false)

  async helpToggled(){
    this.isShowingHelp.set(!(this.isShowingHelp()))
  }
}
