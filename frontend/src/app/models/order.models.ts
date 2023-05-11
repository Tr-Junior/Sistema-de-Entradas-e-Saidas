
export interface SaleItem {
  product: string;
  quantity: number;
  price: number;
  _id: string;
}
export interface Order {
  sale: {
    items: SaleItem[];
    discount: number;
    total: number;
    formPayment: string;
  };
  _id: string;
  number: string;
  createDate: String;
}
export interface PaymentTotal {
  formPayment: string;
  total: number;
}
