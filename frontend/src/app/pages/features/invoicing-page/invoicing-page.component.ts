import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Entrances } from 'src/app/models/entrances.model';
import { Exits } from 'src/app/models/exits.model';
import { Product } from 'src/app/models/product.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-invoicing-page',
  templateUrl: './invoicing-page.component.html',
  styleUrls: ['./invoicing-page.component.css']
})
export class InvoicingPageComponent {
  public busy = false;
  public pt: any;
  public entrances: Entrances[] = [];
  public entrancesId: any;
  public name: any;
  public startDate: any;
  public endDate: any;


  constructor(
    private service: DataService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    this.listEntrances();
  };


  searchDate() {
    if (this.startDate && this.endDate) {
      this.getExitsByDateRange(this.startDate, this.endDate);
    } else {
      this.listEntrances();
    }
  }

  getExitsByDateRange(startDate: string, endDate: string) {
    this.busy = true;
    this.service.getEntrances().subscribe(
      (data: any) => {
        this.busy = false;
        const start = new Date(startDate);
        const end = new Date(endDate);
        this.entrances = data.filter((entrances: Entrances) => {
          const date = new Date(entrances.createDate);
          return date >= start && date <= end;
        });
      }
    );
  }

  listEntrances() {
    this.service.getEntrances().subscribe((data: any) => {
      this.busy = false;
      this.entrances = data.filter((entrances: Entrances) => {
        const exitDate = new Date(entrances.createDate);
        const currentDate = new Date();
        return exitDate.getMonth() === currentDate.getMonth();
      });
    });
  }

  // listEntrances() {
  //   this
  //     .service
  //     .getEntrances()
  //     .subscribe(
  //       (data: any) => {
  //         this.busy = false;
  //         this.entrances = data;
  //       })
  // }


  getEntrancesById(id: any) {
    this
      .service
      .getEntrancesById(id)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.entrancesId = data._id
          console.log(data._id);
        }
      );

  }


  delete(id: any, code: any) {
    this
      .service
      .delEntrances(id)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Produto deletado' });

          console.log(data);
        },
        (err: any) => {
          this.toastr.error(err.message);
          this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
          this.busy = false;
          console.log(err);
        }

      );
    this
      .service
      .delOrderByCode(code)
      .subscribe((data: any) => {
        this.busy = false;
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Entrada Deletada' });
        this.listEntrances();
        console.log(data);
      })
    this.listEntrances();
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

}
