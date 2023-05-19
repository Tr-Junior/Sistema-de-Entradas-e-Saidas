import { Component, ElementRef, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Entrances } from 'src/app/models/entrances.model';
import { Exits } from 'src/app/models/exits.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent {
  public exits: Exits[] = [];
  public entrances: Entrances[] = [];
  public startDate: any;
  public endDate: any;
  public name: any;
  public saldo: number = 0;
  public totalEntrances: number = 0;
  public totalExits: number = 0;
  public result: number = 0;
  public ptBR: any;
  public data: any[] = [];
  public options: any;

  constructor(
    private service: DataService,
    private primengConfig: PrimeNGConfig,
  ) {

    this.ptBR = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      today: 'Hoje',
      clear: 'Limpar'
    };
  }

  ngOnInit() {
    this.listEntrances();
    this.listExits();
    this.primengConfig.setTranslation(this.ptBR);
  };

  listExits() {
    this.service.getExits().subscribe((data: any) => {
      this.exits = data.filter((exit: Exits) => {
        const exitDate = new Date(exit.date);
        const currentDate = new Date();
        return exitDate.getMonth() === currentDate.getMonth();
      });
      this.totalExits = this.exits.reduce((sum, exit) => sum + exit.value, 0);
      this.calculateResult();
    });
  }

  listEntrances() {
    this.service.getEntrances().subscribe((data: any) => {
      this.entrances = data.filter((entrances: Entrances) => {
        const exitDate = new Date(entrances.createDate);
        const currentDate = new Date();
        return exitDate.getMonth() === currentDate.getMonth();
      });
      this.totalEntrances = this.entrances.reduce((sum, entrance) => sum + entrance.value, 0);
      this.calculateResult();
    });
  }

  search() {
    if (this.name == "") {
      this.ngOnInit();
    } else {
      this.entrances = this.entrances.filter(res => {
        return res.typeOrder.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
      })
    }
  }

  searchDate() {
    if (this.startDate && this.endDate) {
      this.getInOutByDateRange(this.startDate, this.endDate);
    } else {
      this.listExits();
    }
  }

  getInOutByDateRange(startDate: string, endDate: string) {
    this.service.getExits().subscribe(
      (exitsData: any) => {
        this.service.getEntrances().subscribe(
          (entrancesData: any) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            this.exits = exitsData.filter((exit: Exits) => {
              const date = new Date(exit.date);
              return date >= start && date <= end;
            });
            this.entrances = entrancesData.filter((entrances: Entrances) => {
              const date = new Date(entrances.createDate);
              return date >= start && date <= end;
            });
            this.totalExits = this.exits.reduce((sum, exit) => sum + exit.value, 0);
            this.totalEntrances = this.entrances.reduce((sum, entrance) => sum + entrance.value, 0);
            this.calculateResult();
          }
        );
      }
    );
  }

  calculateResult() {
    this.result = this.totalEntrances - this.totalExits;
  }

  clearSearch() {
    this.startDate = null;
    this.endDate = null;
    this.listExits();
    this.listEntrances();
  }
}
