import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order, PaymentTotal, SaleItem } from 'src/app/models/order.models';
import { TableModule } from 'primeng/table';
import { DataService } from 'src/app/services/data.service';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-sales-page',
  templateUrl: './sales-page.component.html',
  styleUrls: ['./sales-page.component.css']
})
export class SalesPageComponent {
  public paymentTotals: PaymentTotal[] = [];
  public order: Order[] = [];
  public saleItems: SaleItem[] = [];
  public busy = false;
  public id: any;
  public date?: Date;
  public prodId = "";
  public name: any;
  public paymentsMap?: any;



  constructor(
    private data: DataService,
    private messageService: MessageService,
    private service: DataService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listSalesValue();
    this.listSales();
  }

  listSales() {
    this
      .service
      .getOrder()
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.order = data;
        })
  }
  delete(id: any, code: any) {
    this
      .service
      .delOrder(id)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.toastr.success(data.message);
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Venda Deletada' });
          this.listSales();
          this.listSalesValue();
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
      .delEntrancesByCode(code)
      .subscribe((data: any) => {
        this.busy = false;
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Entrada Deletada' });
        this.listSales();
        this.listSalesValue();
        console.log(data);
      })

  }


  listSalesValue() {
    this.service.getOrder().subscribe((data: any) => {
      this.busy = false;
      this.order = data;

      // Cria um Map para agrupar as vendas por forma de pagamento
      this.paymentsMap = new Map<string, number>();
      for (const order of this.order) {
        const payment = order.sale.formPayment;
        const total = order.sale.total;
        if (this.paymentsMap.has(payment)) {
          this.paymentsMap.set(payment, this.paymentsMap.get(payment) + total);
        } else {
          this.paymentsMap.set(payment, total);
        }
      }

      // Converte o Map em um array de PaymentTotal e armazena na propriedade paymentTotals
      this.paymentTotals = Array.from(this.paymentsMap, ([formPayment, total]) => ({ formPayment, total }));
    });
  }

}

