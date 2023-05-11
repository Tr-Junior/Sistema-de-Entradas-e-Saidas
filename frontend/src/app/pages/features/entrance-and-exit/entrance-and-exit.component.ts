import { Component } from '@angular/core';
import { faChartColumn, faChartBar, faChartGantt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-entrance-and-exit',
  templateUrl: './entrance-and-exit.component.html',
  styleUrls: ['./entrance-and-exit.component.css']
})
export class EntranceAndExitComponent {
  faChartColumn = faChartColumn;
  faChartBar = faChartBar;
  faChartGantt = faChartGantt;
}
