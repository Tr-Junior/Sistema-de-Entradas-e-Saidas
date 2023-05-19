import { Component } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item.model';
import { Cart } from 'src/app/models/cart-model';
import { Product } from 'src/app/models/product.model';
import { CartUtil } from 'src/app/utils/cart-util';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { DataService } from 'src/app/services/data.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { Security } from 'src/app/utils/Security.util';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sale-page',
  templateUrl: './sale-page.component.html',
  styleUrls: ['./sale-page.component.css']
})
export class SalePageComponent {
  public cart: Cart = new Cart();
  public cartItems: CartItem[] = [];
  public product: Product[] = [];
  public products: Product[] = [];
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
  public searchQuery: string = '';
  private intervalId: any;
  public searching: boolean = false;
  public user!: User;
  public total = 0;
  public totalTroco = 0;

  constructor(
    private toastr: ToastrService,
    private service: DataService
  ) {
    this.grandTotal = CartUtil.getGrandTotal();
    this.formPaymentOptions = this.getPaymentMethods().map(option => ({ label: option, value: option }));
    this.selectedPayment = CartUtil.get().paymentForm;

    // this.itemTotal = this.cart.itemTotalWithDiscount
    this.subtotal = CartUtil.getSubtotal();
    this.generalDiscount = this.cart.generalDiscount || 0;
    this.grandTotal = CartUtil.getGrandTotal();
  }

  ngOnInit() {
    this.loadCart();
    this.listProdSilent();
    this.user = Security.getUser();
  }

  loadCart() {
    this.cart = CartUtil.get();
    this.cartItems = CartUtil.get().items;
    this.subtotal = CartUtil.getSubtotal();
    this.grandTotal = CartUtil.getGrandTotal();
    this.generalDiscount = this.cart.generalDiscount || 0;
  }

  listProdSilent() {
    this.busy = true;
    this.service.getProduct().subscribe({
      next: (data: any) => {
        this.busy = false;
        this.products = data;
      },
      error: (err: any) => {
        console.log(err);
        this.busy = false;
        this.toastr.error(err.message);
      }
    });
  }

  addToCart(data: any): void {
    const product = this.product.find(p => p._id === data._id);
    if (product) {
      const item: CartItem = {
        _id: product._id,
        title: product.title,
        price: product.price,
        quantity: 1,
        discount: 0,
        totalWithDiscount: 0
      };
      const cart = CartUtil.get();
      const cartItem = cart.items.find(item => item._id === product._id);

      if (cartItem) {
        if (cartItem.quantity < product.quantity) {
          if (item.quantity > 1 && (cartItem.quantity + item.quantity) > product.quantity) {
            this.toastr.error('Quantidade solicitada maior que o estoque', 'Erro');
            return;
          }
          cartItem.quantity += item.quantity;
          this.toastr.success(data.message, 'Produto adicionado');
        } else {
          this.toastr.error('Quantidade solicitada maior que o estoque', 'Erro');
          return;
        }
      } else {
        if (item.quantity > product.quantity) {
          this.toastr.error('Quantidade solicitada maior que o estoque', 'Erro');
          return;
        }
        cart.items.push(item);
        this.toastr.success(data.message, 'Produto adicionado');
      }
      CartUtil.add(item._id, item.title, item.quantity, item.price, item.discount, item.totalWithDiscount);
      this.loadCart();
    }
  }

  calculateTotal() {
    this.subtotal = 0;
    for (const item of this.cartItems) {
      item.totalWithDiscount = CartUtil.calculoItemWithDiscount(item); // Calcula o total do item com desconto
      this.subtotal += item.totalWithDiscount;
    }
    this.grandTotal = CartUtil.getGrandTotal();
    this.calcTroco();
  }

  updateGeneralDiscount(generalDiscount: number): void {
    CartUtil.addGeneralDiscount(generalDiscount);
    this.generalDiscount = generalDiscount;
    this.grandTotal = CartUtil.getGrandTotal();
  }

  saveItemDiscount(itemId: string, itemDiscount: number) {
    CartUtil.updateItemDiscount(itemId, itemDiscount);
    const item = this.cartItems.find(i => i._id === itemId);
    if (item) {
      item.totalWithDiscount = CartUtil.calculoItemWithDiscount(item);
    }
    this.subtotal = CartUtil.getSubtotal();
    this.grandTotal = CartUtil.getGrandTotal();
  }

  increaseItemQuantity(itemId: string): void {
    const product = this.products.find(i => i._id === itemId);
    const item = this.cart.items.find(i => i._id === itemId);
    if (item) {
      if (item.quantity < product!.quantity) {
        item.quantity++;
        CartUtil.add(item._id, item.title, 1, item.price, item.discount, item.totalWithDiscount);
      } else {
        this.toastr.error('Quantidade solicitada maior que o estoque', 'Erro');
      }
      this.loadCart();
    }
  }

  decreaseItemQuantity(itemId: string): void {
    const item = this.cart.items.find(i => i._id === itemId);
    if (item) {
      item.quantity--;
      if (item.quantity < 1) {
        this.remove(item);
      } else {
        CartUtil.add(item._id, item.title, -1, item.price, item.discount, item.totalWithDiscount);
        this.loadCart();
      }
    }
  }

  startIncreasing(itemId: string) {
    // execute a função de incremento imediatamente
    this.increaseItemQuantity(itemId);

    // inicie o intervalo de incremento a cada 200ms
    this.intervalId = setInterval(() => {
      this.increaseItemQuantity(itemId);
    }, 100);
  }

  stopIncreasing() {
    // cancele o intervalo de incremento
    clearInterval(this.intervalId);
  }

  updateItem(data: CartItem) {
    CartUtil.calculoItemWithDiscount(data);
    this.loadCart();
    this.cartItems = CartUtil.getItems();
    this.subtotal = CartUtil.getSubtotal();
    this.grandTotal = CartUtil.getGrandTotal();
  }

  remove(data: any): void {
    CartUtil.removeItem(data);
    this.loadCart();
    this.toastr.success(data.message, 'Produto removido do carrinho');
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
    return ['Crédito', 'Débito', 'Dinheiro', 'Pix'];
  }

  submitOrder() {
    if (!this.selectedPayment) {
      this.toastr.error('Selecione a forma de pagamento', 'Erro');
      return;
    }
    // Cria um objeto contendo as informações do cliente e dos itens do carrinho
    const order = {
      customer: this.user.name,
      sale: {
        items: this.cartItems.map(item => {
          return {
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            title: item.title,
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
    this.clearPaymentMethod();
    this.loadCart();
    this.clearTroco();
  }

  clearPaymentMethod(): void {
    this.selectedPayment = undefined;
  }

  resetForm() {
    this.form.reset();
  }

  search(): void {
    if (!this.searchQuery) {
      this.product = [];
      return;
    }

    this.busy = true;
    this.service.searchProduct(this.searchQuery).subscribe({
      next: (data: any) => {
        this.busy = false;
        this.product = data;
      },
      error: (err: any) => {
        console.log(err);
        this.busy = false;
        this.toastr.error(err.message);
      }
    });
  }

  onFormPaymentSelected(formPayment: string): void {
    this.selectedPayment = formPayment;
    CartUtil.addPaymentFor(formPayment);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search();
  }

  calcTroco() {
    if (this.total > 0) {
      this.grandTotal = CartUtil.getGrandTotal();
      this.totalTroco = this.total - this.grandTotal;
      return this.totalTroco;
    } else {
      return this.totalTroco = 0;
    }
  }

  clearTroco() {
    this.total = 0;
    this.calcTroco();
  }
}
