import { Cart } from "../models/cart-model";
import { CartItem } from "../models/cart-item.model";
import { Product } from "../models/product.model";
import { DataService } from "../services/data.service";

export class CartUtil {
  public static get(): Cart {
    // Recupera os dados do LocalStorage
    const data = localStorage.getItem('shopcart');

    // Caso não haja dados, retorna um novo carrinho
    if (!data)
      return new Cart();

    // Caso haja dados, retorna o carrinho
    return JSON.parse(data);
  }

  public static add(
    _id: string,
    title: string,
    quantity: number,
    price: number,
    discount: number,
    totalWithDiscount: number
  ) {
    // Obtém o carrinho
    let cart = this.get();

    // Gera o novo item
    const item = new CartItem(_id, title, quantity, discount, price, totalWithDiscount);

    // Calcula o valor total com desconto do item
    item.totalWithDiscount = (item.quantity * item.price) - ((item.quantity * item.price) * item.discount / 100);
    // Adiciona ao carrinho

    const existingItemIndex = cart.items.findIndex(i => i._id === item._id);
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += item.quantity;
      cart.items[existingItemIndex].totalWithDiscount += item.totalWithDiscount;
    } else {
      cart.items.push(item);
    }
    // Salva no localStorage
    this.update(cart);

  }


  public static addPaymentFor(paymentForm: string): void {
    let cart = this.get();
    cart.paymentForm = paymentForm;
    this.update(cart);
  };

  public static addGeneralDiscount(generalDiscount: number): void {
    let cart = this.get();
    cart.generalDiscount = generalDiscount;
    this.update(cart);
  };


  public static updateItemDiscount(itemId: string, itemDiscount: number): void {
    // Obtém o carrinho atual
    const cart = this.get();

    // Encontra o item pelo ID
    const itemIndex = cart.items.findIndex(item => item._id === itemId);

    // Atualiza o desconto do item e recalcula o valor total com desconto
    if (itemIndex !== -1) {
      const item = cart.items[itemIndex];
      item.discount = itemDiscount;
      item.totalWithDiscount = item.quantity * item.price * (1 - item.discount / 100);
    }

    // Salva a lista de itens atualizada no LocalStorage
    this.update(cart);
  }

  public static clear() {
    localStorage.removeItem('shopcart');

  }
  public static getItems(): CartItem[] {
    return this.get().items;
  }


  public static calculoItemWithDiscount(item: CartItem): number {
    item.totalWithDiscount = (item.quantity * item.price) - ((item.quantity * item.price) * item.discount / 100);
    return item.totalWithDiscount;
  }




  public static removeItem(item: CartItem): void {
    let cart = this.get();
    const index = cart.items.findIndex(i => i._id === item._id);
    if (index > -1) {
      cart.items.splice(index, 1);
    }
    this.update(cart);
  }

  public static getSubtotal(): number {
    return this.getItems().reduce((total, item) => {
      if (item.discount != 0) {
        return total + item.totalWithDiscount;
      } else {
        return total + (item.quantity * item.price);
      }
    }, 0);
  }
  public static getTotal(): number {
    return this.getItems().reduce((total, item) => {
      return total = (item.quantity * item.price) - ((item.quantity * item.price) * item.discount / 100);
    }, 0);
  }
  public static getGrandTotal(): number {
    const cart = this.get();
    const subtotal = this.getSubtotal();
    return subtotal - (subtotal * cart.generalDiscount! / 100);
  }


  public static getItemTotalWithDiscount(item: CartItem): number {
    return item.totalWithDiscount * item.quantity;
  }

  public static getItemTotalWithDiscountAndGeneralDiscount(item: CartItem, generalDiscount: number): number {
    return this.getItemTotalWithDiscount(item) - (this.getItemTotalWithDiscount(item) * generalDiscount / 100);
  }

  private static update(cart: Cart) {
    localStorage.setItem('shopcart', JSON.stringify(cart));
  }



}
