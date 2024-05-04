import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { PrimeNGConfig } from 'primeng/api';
import { Order } from 'src/app/models/order.models';

@Component({
  selector: 'app-sales-page',
  templateUrl: './sales-page.component.html',
  styleUrls: ['./sales-page.component.css']
})
export class SalesPageComponent implements OnInit {
  public paymentTotals: PaymentTotal[] = []; // Array para armazenar os totais de pagamento
  public order: Order[] = []; // Array para armazenar as vendas
  public busy = false; // Variável para indicar se a página está ocupada
  public id: any; // ID da venda
  public date?: Date; // Data da venda
  public prodId = ""; // ID do produto
  public name: any; // Nome
  public paymentsMap?: any;
  public rangeDates?: Date[];
  // Mapa para armazenar os totais de pagamento por tipo
  public color: any; // Cor
  public startDate: any; // Data inicial para filtrar as vendas por período
  public endDate: any; // Data final para filtrar as vendas por período
  public ptBR: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private service: DataService,
    private toastr: ToastrService
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
    this.listSalesValue(); // Listar os totais de pagamento
    this.listSales(); // Listar as vendas
    this.primengConfig.setTranslation(this.ptBR);
  }

  listSales() {
    this.busy = true;
    this.service.getOrder().subscribe(
      (data: any) => {
        const currentDate = new Date();
        // Filtrar as vendas pelo dia atual
        this.order = data.filter((order: Order) => {
          const exitDate = new Date(order.createDate);
          return (
            exitDate.getDate() === currentDate.getDate() &&
            exitDate.getMonth() === currentDate.getMonth() &&
            exitDate.getFullYear() === currentDate.getFullYear()
          );
        });

        this.busy = false;
      },
      (err: any) => {
        console.log(err);
        this.busy = false;
      }
    );
  }

  listSalesValue() {
    this.busy = true;
    this.service.getOrder().subscribe(
      (data: any) => {
        const currentDate = new Date();
        // Filtrar as vendas pelo dia atual
        this.order = data.filter((order: Order) => {
          const exitDate = new Date(order.createDate);
          return (
            exitDate.getDate() === currentDate.getDate() &&
            exitDate.getMonth() === currentDate.getMonth() &&
            exitDate.getFullYear() === currentDate.getFullYear()
          );
        });

        this.calculatePaymentTotals();

        this.busy = false;
      },
      (err: any) => {
        console.log(err);
        this.busy = false;
      }
    );
  }

  searchDate() {
    if (this.rangeDates && this.rangeDates.length > 0) {
      const startDate = this.rangeDates[0];
      const endDate = this.rangeDates.length > 1 ? this.rangeDates[1] : startDate;
      this.getSalesByDateRange(startDate, endDate);
    } else {
      this.listSales();
    }
  }

  getSalesByDateRange(startDate: Date, endDate: Date) {
    this.busy = true;
    this.service.getOrder().subscribe(
      (data: any) => {
        const selectedDate = new Date(startDate);
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1); // Adiciona um dia ao endDate

        this.order = data.filter((order: Order) => {
          const orderDate = new Date(order.createDate);
          return orderDate >= selectedDate && orderDate < nextDay;
        });

        this.calculatePaymentTotals();

        this.busy = false;
      },
      (err: any) => {
        console.log(err);
        this.busy = false;
      }
    );
  }




  calculatePaymentTotals() {
    this.paymentsMap = new Map<string, { total: number; color: string }>();
    let totalSum = 0;

    for (const order of this.order) {
      const payment = order.sale.formPayment;
      const total = order.sale.total;

      totalSum += total;

      if (this.paymentsMap.has(payment)) {
        this.paymentsMap.set(payment, {
          total: this.paymentsMap.get(payment).total + total,
          color: this.paymentsMap.get(payment).color
        });
      } else {
        let color = '';
        switch (payment) {
          case 'Dinheiro':
            color = 'payment-cash';
            break;
          case 'Crédito':
            color = 'payment-credit';
            break;
          case 'Débito':
            color = 'payment-debit';
            break;
          case 'Pix':
            color = 'payment-pix';
            break;
          default:
            color = 'payment-others';
            break;
        }
        this.paymentsMap.set(payment, { total, color });
      }
    }

    this.paymentTotals = Array.from(this.paymentsMap, ([formPayment, { total, color }]) => ({
      formPayment,
      total,
      color
    }));

    this.paymentTotals.push({ formPayment: 'Total', total: totalSum, color: '' });
  }

  // Deletar uma venda
  delete(id: any, code: any) {
    this.busy = true;
    this.service.delOrder(id).subscribe(
      (data: any) => {
        this.toastr.success(data.message, 'Venda deletada');
        this.listSales(); // Atualizar a lista de vendas
        this.listSalesValue(); // Atualizar os totais de pagamento
        console.log(data);
      },
      (err: any) => {
        this.toastr.error(err.message, 'Erro ao deletar venda');
        console.log(err);
      },
      () => {
        this.service.delEntrancesByCode(code).subscribe(
          (data: any) => {
            this.toastr.success('Entrada deletada');
            this.listSales(); // Atualizar a lista de vendas
            this.listSalesValue(); // Atualizar os totais de pagamento
            console.log(data);
          },
          (err: any) => {
            console.log(err);
          },
          () => {
            this.busy = false;
          }
        );
      }
    );
  }

  // Pesquisar por nome de pagamento
  search() {
    if (this.name === '') {
      this.ngOnInit();
    } else {
      this.order = this.order.filter((res: any) => {
        return res.sale.formPayment.toLowerCase().match(this.name.toLowerCase());
      });
    }
  }

  // Limpar a pesquisa
  clearSearch() {
    this.rangeDates = [];
    this.listSales(); // Listar todas as vendas novamente
    this.listSalesValue(); // Atualizar os totais de pagamento
  }
}

interface PaymentTotal {
  formPayment: string;
  total: number;
  color: any;
}
