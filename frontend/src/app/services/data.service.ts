import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { Observable } from "rxjs";
import { Order } from "../models/order.models";
import { Security } from "../utils/Security.util";
import { Exits } from "../models/exits.model";
import { Entrances } from "../models/entrances.model";
import { User } from "../models/user.model";
import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public API = `${environment.API}`;


  constructor(private http: HttpClient) { }

  public composeHeaders() {
    const token = Security.getToken();
    const headers = new HttpHeaders().set('x-access-token', token);
    return headers;

  }

  // Produtos
  searchProduct(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API}/products/search/` + name, { headers: this.composeHeaders() });
  }
  getProduct(): Observable<any> {
    return this.http.get<Product[]>(`${this.API}/products`, { headers: this.composeHeaders() });
  }
  getProductById(id: any): Observable<any> {
    return this.http.get(`${this.API}/products/getById/` + id, { headers: this.composeHeaders() });
  }
  getProducts() {
    return this.http.get<Product[]>(`${this.API}/products`, { headers: this.composeHeaders() });
  }
  createProduct(data: any) {
    return this.http.post(`${this.API}/products`, data, { headers: this.composeHeaders() });
  }

  updateProduct(data: any): Observable<any> {
    return this.http.put(`${this.API}/products/updateBody`, data, { headers: this.composeHeaders() });
  }
  delProd(id: any): Observable<any> {
    return this.http.delete(`${this.API}/products/` + id, { headers: this.composeHeaders() })
  }

  // Saidas

  createExits(data: any) {
    return this.http.post(`${this.API}/exits`, data, { headers: this.composeHeaders() });
  }
  searchExits(description: string): Observable<Exits[]> {
    return this.http.get<Exits[]>(`${this.API}/exits/search/` + description, { headers: this.composeHeaders() });
  }
  getExits(): Observable<any> {
    return this.http.get<Exits[]>(`${this.API}/exits`, { headers: this.composeHeaders() });
  }
  getExitsById(id: any): Observable<any> {
    return this.http.get(`${this.API}/exits/getById/` + id, { headers: this.composeHeaders() });
  }
  updateExits(data: any): Observable<any> {
    return this.http.put(`${this.API}/exits/update`, data, { headers: this.composeHeaders() });
  }
  delExits(id: any): Observable<any> {
    return this.http.delete(`${this.API}/exits/` + id, { headers: this.composeHeaders() });
  }

  // Entradas

  getEntrances(): Observable<any> {
    return this.http.get<Entrances[]>(`${this.API}/entrance`, { headers: this.composeHeaders() });
  }
  getEntrancesById(id: any): Observable<any> {
    return this.http.get(`${this.API}/entrance/getById/` + id, { headers: this.composeHeaders() });
  }
  delEntrances(id: any): Observable<any> {
    return this.http.delete(`${this.API}/entrance/` + id, { headers: this.composeHeaders() });
  }
  delEntrancesByCode(code: any): Observable<any> {
    return this.http.delete(`${this.API}/entrance/deleteByCode/` + code, { headers: this.composeHeaders() });
  }
  // Carrinho de compras

  createOrder(data: any) {
    return this.http.post(`${this.API}/orders`, data, { headers: this.composeHeaders() });
  }
  getOrder(): Observable<any> {
    return this.http.get<Order[]>(`${this.API}/orders`, { headers: this.composeHeaders() });
  }
  getOrderById(id: any): Observable<any> {
    return this.http.get(`${this.API}/orders/getById/` + id, { headers: this.composeHeaders() });
  }
  delOrder(id: any): Observable<any> {
    return this.http.delete(`${this.API}/orders/` + id, { headers: this.composeHeaders() });
  }
  delOrderByCode(code: any): Observable<any> {
    return this.http.delete(`${this.API}/orders/deleteByCode/` + code, { headers: this.composeHeaders() });
  }


  //Autenticação


  authenticate(data: any) {
    return this.http.post(`${this.API}/customers/authenticate`, data);
  }
  refreshToken() {
    return this.http.post(`${this.API}/customers/refresh-token`, null, { headers: this.composeHeaders() });
  }


  //Usuario

  createUser(data: any) {
    return this.http.post(`${this.API}/customers`, data, { headers: this.composeHeaders() });
  }
  getUserById(id: any): Observable<any> {
    return this.http.get<User[]>(`${this.API}/customers/getById/${id}`, { headers: this.composeHeaders() });
  }
  updatePassword(data: any): Observable<any> {
    return this.http.put(`${this.API}/customers/update-password`, data, { headers: this.composeHeaders() });
  }
  checkUsernameExists(name: string) {
    return this.http.get<boolean>(`${this.API}/customers/check-username/${name}`, { headers: this.composeHeaders() });
  }

}
