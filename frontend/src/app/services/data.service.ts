import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { Observable } from "rxjs";
import { Order } from "../models/order.models";
import { Security } from "../utils/Security.util";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public url = 'http://localhost:3001'

  constructor(private http: HttpClient) { }

  public composeHeaders() {
    const token: any = Security.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return headers;

  }

  // Produtos
  getProducts() {
    return this.http.get<Product[]>(`${this.url}/products`);
  }
  createProduct(data: any) {
    return this.http.post(`${this.url}/products`, data);
  }
  getProduct(): Observable<any> {
    return this.http.get<Product[]>(`${this.url}/products`);
  }
  getProductById(id: any): Observable<any> {
    return this.http.get(`${this.url}/products/getById/` + id);
  }
  updateProduct(id: any, data: any): Observable<any> {
    return this.http.put(`${this.url}/products/update/` + id, data);
  }
  delProd(id: any): Observable<any> {
    return this.http.delete(`${this.url}/products/` + id)
  }

  // Saidas

  createExits(data: any) {
    return this.http.post(`${this.url}/exits`, data);
  }
  getExits(): Observable<any> {
    return this.http.get<Product[]>(`${this.url}/exits`);
  }
  getExitsById(id: any): Observable<any> {
    return this.http.get(`${this.url}/exits/getById/` + id);
  }
  updateExits(id: any, data: any): Observable<any> {
    return this.http.put(`${this.url}/exits/update/` + id, data);
  }
  delExits(id: any): Observable<any> {
    return this.http.delete(`${this.url}/exits/` + id);
  }

  // Entradas

  getEntrances(): Observable<any> {
    return this.http.get<Product[]>(`${this.url}/entrance`);
  }
  getEntrancesById(id: any): Observable<any> {
    return this.http.get(`${this.url}/entrance/getById/` + id);
  }
  delEntrances(id: any): Observable<any> {
    return this.http.delete(`${this.url}/entrance/` + id);
  }
  delEntrancesByCode(code: any): Observable<any> {
    return this.http.delete(`${this.url}/entrance/deleteByCode/` + code);
  }
  // Carrinho de compras

  createOrder(data: any) {
    return this.http.post(`${this.url}/orders`, data);
  }

  getOrder(): Observable<any> {
    return this.http.get<Order[]>(`${this.url}/orders`);
  }
  getOrderById(id: any): Observable<any> {
    return this.http.get(`${this.url}/orders/getById/` + id);
  }
  delOrder(id: any): Observable<any> {
    return this.http.delete(`${this.url}/orders/` + id);
  }
  delOrderByCode(code: any): Observable<any> {
    return this.http.delete(`${this.url}/orders/deleteByCode/` + code);
  }


  //Autenticação

  resetPassword(data: any) {
    return this.http.post(`${this.url}/accounts/reset-password`, data);
  }
  authenticate(data: any) {
    return this.http.post(`${this.url}/customers/authenticate`, data);
  }
  refreshToken() {
    return this.http.post(`${this.url}/accounts/refresh-token`, null, { headers: this.composeHeaders() });
  }
  getProfile() {
    return this.http.get(`${this.url}/accounts`, { headers: this.composeHeaders() });

  }
  updateProfile(data: any) {
    return this.http.post(`${this.url}/accounts`, { headers: this.composeHeaders() });

  }
}
