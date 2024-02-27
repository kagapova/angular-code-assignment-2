import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-root-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() image: string = '';
  @Input() header: string = '';
  @Input() votes: number = 0;

  @Input() points: number = 0;

  @Input() name: string = '';

  @Input() icon: string = '';

  @Input() backgroundColor: string = '';

  @Input() fontColor: string = '';
}
