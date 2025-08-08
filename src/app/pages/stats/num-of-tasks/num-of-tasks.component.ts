import { Component, inject } from '@angular/core';
import { TRPC_CLIENT } from '../../../utils/trpc.client';
import { MatCard } from '@angular/material/card';
import { MatCardHeader } from "../../../../../node_modules/@angular/material/card/index";

@Component({
  selector: 'app-num-of-tasks',
  imports: [MatCard, MatCardHeader],
  templateUrl: './num-of-tasks.component.html',
  styleUrl: './num-of-tasks.component.scss'
})
export class NumOfTasksComponent {
  trpc = inject(TRPC_CLIENT);

  
}
