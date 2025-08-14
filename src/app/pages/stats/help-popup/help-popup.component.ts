import { Component, output } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-help-popup',
  imports: [MatCard, MatCardTitle, MatCardContent, MatButtonModule],
  templateUrl: './help-popup.component.html',
  styleUrl: './help-popup.component.scss'
})
export class HelpPopupComponent {
  closeClicked = output()


}
