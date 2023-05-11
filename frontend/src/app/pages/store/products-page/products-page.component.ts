import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { DataService } from 'src/app/services/data.service';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { CartUtil } from 'src/app/utils/cart-util';
import { CartItem } from 'src/app/models/cart-item.model';


@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent implements OnInit {
  @Input() products!: Product;

  public product: Product[] = [];
  public form: FormGroup;
  public busy = false;
  prodId = "";
  name: any;


  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private data: DataService,
    private service: DataService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {

    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required
      ])],
      quantity: ['', Validators.compose([
        Validators.required
      ])],
      purchasePrice: ['', Validators.compose([
        Validators.required
      ])],
      price: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngOnInit() {
    this.listProd();
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
    }
  }

  resetForm() {
    this.form.reset();
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

  getProductById(id: any) {
    this
      .service
      .getProductById(id)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.prodId = data._id
          this.form.patchValue(data);
          console.log(data._id);
        }
      );

  }


  refresh(): void {
    window.location.reload();
  }

  save() {
    if (this.prodId == '') {
      this.submit();
    }
    else {
      this.update();
    }

  }

  submit() {
    this.busy = true;
    this
      .service
      .createProduct(this.form.value)
      .subscribe({
        next: (data: any) => {
          this.busy = false;
          this.toastr.success(data.message);
          this.resetForm();
          this.listProd();
          console.log();
        },
        error: (err: any) => {
          console.log(err);
          this.busy = false;
        }
      }

      );
  }

  update() {
    this.busy = true;
    this
      .service
      .updateProduct(this.prodId, this.form.value)
      .subscribe({
        next: (data: any) => {
          this.busy = false;
          this.toastr.success(data.message, 'Atualizado');
          this.resetForm();
          this.listProd();
          console.log(this.form.value);
        },
        error: (err: any) => {
          console.log(err);
          this.busy = false;
        }
      }
      );
  }

  delete(id: any) {
    this
      .service
      .delProd(id)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.toastr.success(data.message);
          this.listProd();
          console.log(data);
        },
        (err: any) => {
          this.toastr.error(err.message);
          this.busy = false;
          console.log(err);
        }

      );
  }



  search() {
    if (this.name == "") {
      this.ngOnInit();
    } else {
      this.product = this.product.filter(res => {
        return res.title.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
      })
    }
  }

}
