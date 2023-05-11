import { Component } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item.model';
import { Cart } from 'src/app/models/cart-model';
import { Product } from 'src/app/models/product.model';
import { CartUtil } from 'src/app/utils/cart-util';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { DataService } from 'src/app/services/data.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sale-page',
  templateUrl: './sale-page.component.html',
  styleUrls: ['./sale-page.component.css']
})
export class SalePageComponent {
  public cart: Cart = new Cart();
  public cartItems: CartItem[] = [];
  public product: Product[] = [];
  public selectedPayment?: string;
  public subtotal: number;
  public grandTotal: number;
  public itemTotal: number = 0;
  public formPayment!: string;
  public formPaymentOptions: { label: string, value: string }[];
  public generalDiscount: number = 0;
  public totalWithDiscount: number = 0;
  public busy = false;
  public form!: FormGroup;

  constructor(
    private messageService: MessageService,
    private toastr: ToastrService,
    private service: DataService
  ) {
    this.grandTotal = CartUtil.getGrandTotal();
    this.formPaymentOptions = this.getPaymentMethods().map(option => ({ label: option, value: option }));
    this.selectedPayment = CartUtil.get().paymentForm;


    this.subtotal = CartUtil.getSubtotal();
    this.generalDiscount = this.cart.generalDiscount || 0;
    this.grandTotal = CartUtil.getGrandTotal();
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cart = CartUtil.get();
    this.cartItems = CartUtil.get().items;
    this.subtotal = CartUtil.getSubtotal();
    this.grandTotal = CartUtil.getGrandTotal();
    this.generalDiscount = this.cart.generalDiscount || 0;
  }

  listProd() {
    this
      .service
      .getProduct()
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.product = data;
        })
  }

  public onFormPaymentSelected(formPayment: string): void {
    this.selectedPayment = formPayment;
    CartUtil.addPaymentFor(formPayment);
  }

  updateGeneralDiscount(geneneralDiscount: number): void {// atualiza o desconto geral no carrinho
    CartUtil.addGeneralDiscount(geneneralDiscount);
    this.generalDiscount = geneneralDiscount;
    this.grandTotal = CartUtil.getGrandTotal(); // recalcula o total com o novo desconto
  }


  updateItem(data: CartItem) {
    if (data.quantity <= 0) {
      CartUtil.removeItem(data)

    } else {
      CartUtil.updateItemQuantity(data);
    }
    this.loadCart();
    this.cartItems = CartUtil.getItems();
    this.subtotal = CartUtil.getSubtotal();
    this.grandTotal = CartUtil.getGrandTotal();
  }


  remove(data: any): void {
    CartUtil.removeItem(data);
    this.loadCart();
    this.messageService.add({ severity: 'success', summary: `${data.title} adicionado ao carrinho`, detail: 'Produto Adicionado' });
    this.cartItems = CartUtil.getItems();
    this.subtotal = CartUtil.getSubtotal();
    this.grandTotal = CartUtil.getGrandTotal();
  }

  clear() {
    CartUtil.clear();
    this.loadCart();
    this.cartItems = CartUtil.getItems();
    this.subtotal = CartUtil.getSubtotal();
    this.grandTotal = CartUtil.getGrandTotal();
  }

  getPaymentMethods(): string[] {
    return ['Crédito', 'Debito', 'Dinheiro', 'Pix'];
  }

  submitOrder() {
    if (!this.selectedPayment) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Selecione uma forma de pagamento.' });
      return;
    }
    const customerId = "6446ba513a32a81d6b67cf38"; // Substitua pelo ID do cliente que está fazendo a compra

    // Cria um objeto contendo as informações do cliente e dos itens do carrinho
    const order = {
      customer: customerId,
      sale: {
        items: this.cartItems.map(item => {
          return {
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            product: item._id
          };
        }),
        formPayment: this.selectedPayment,
        discount: this.generalDiscount,
        total: this.grandTotal
      }
    };

    this.busy = true;
    this.service.createOrder(order).subscribe({
      next: (data: any) => {
        this.busy = false;
        this.toastr.success(data.message);
        CartUtil.clear(); // Limpa o carrinho após a conclusão da compra
        this.loadCart();
      },
      error: (err: any) => {
        console.log(err);
        this.busy = false;
        this.toastr.success(err.message);

      }
    });
  }

  resetForm() {
    this.form.reset();
  }

}

