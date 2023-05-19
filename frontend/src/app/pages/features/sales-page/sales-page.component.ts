import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Order, PaymentTotal } from 'src/app/models/order.models';

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
  public paymentsMap?: any; // Mapa para armazenar os totais de pagamento por tipo
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

  // Listar as vendas
  listSales() {
    this.busy = true;
    this.service.getOrder().subscribe(
      (data: any) => {
        // Filtrar as vendas pelo mês atual
        this.order = data.filter((order: Order) => {
          const exitDate = new Date(order.createDate);
          const currentDate = new Date();
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

  // Listar os totais de pagamento
  listSalesValue() {
    this.busy = true;
    this.service.getOrder().subscribe(
      (data: any) => {
        // Filtrar as vendas pelo mês atual
        this.order = data.filter((order: Order) => {
          const exitDate = new Date(order.createDate);
          const currentDate = new Date();
          return (
            exitDate.getDate() === currentDate.getDate() &&
            exitDate.getMonth() === currentDate.getMonth() &&
            exitDate.getFullYear() === currentDate.getFullYear()
          );
        });



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
            let color;
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

        // Converter o mapa em um array de objetos PaymentTotal
        this.paymentTotals = Array.from(this.paymentsMap, ([formPayment, { total, color }]) => ({
          formPayment,
          total,
          color
        }));

        // Adicionar o total geral no final do array
        this.paymentTotals.push({ formPayment: 'Total', total: totalSum, color: '' });

        this.busy = false;
      },
      (err: any) => {
        console.log(err);
        this.busy = false;
      }
    );
  }

  // Filtrar as vendas por um intervalo de datas
  searchDate() {
    if (this.startDate && this.endDate) {
      this.getSalesByDateRange(this.startDate, this.endDate);
    } else {
      this.listSales();
    }
  }

  // Obter as vendas dentro de um intervalo de datas
  getSalesByDateRange(startDate: string, endDate: string) {
    this.busy = true;
    this.service.getOrder().subscribe(
      (data: any) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        this.order = data.filter((order: Order) => {
          const date = new Date(order.createDate);
          const start = new Date(startDate);
          const end = new Date(endDate);
          const isSingleDaySearch = start.getTime() === end.getTime();

          if (isSingleDaySearch) {
            return (
              date.getDate() === start.getDate() &&
              date.getMonth() === start.getMonth() &&
              date.getFullYear() === start.getFullYear()
            );
          } else {
            return (
              date >= start &&
              date <= end &&
              date.getMonth() >= start.getMonth() &&
              date.getMonth() <= end.getMonth() &&
              date.getDate() >= start.getDate() &&
              date.getDate() <= end.getDate()
            );
          }
        });



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
            let color;
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

        // Converter o mapa em um array de objetos PaymentTotal
        this.paymentTotals = Array.from(this.paymentsMap, ([formPayment, { total, color }]) => ({
          formPayment,
          total,
          color
        }));

        // Adicionar o total geral no final do array
        this.paymentTotals.push({ formPayment: 'Total', total: totalSum, color: '' });

        this.busy = false;
      },
      (err: any) => {
        console.log(err);
        this.busy = false;
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
    this.startDate = null;
    this.endDate = null;
    this.listSales(); // Listar todas as vendas novamente
    this.listSalesValue(); // Atualizar os totais de pagamento
  }
}
