import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { DataService } from 'src/app/services/data.service';
import { CartUtil } from 'src/app/utils/cart-util';



@Component({
  selector: 'app-produc-registration-page',
  templateUrl: './produc-registration-page.component.html',
  styleUrls: ['./produc-registration-page.component.css']
})
export class ProducRegistrationPageComponent {

  public products$!: Observable<Product[]>;
  public form: FormGroup;
  public busy = false;
  id: any;
  date?: Date;
  prodId = "";
  name: any;
  @Input() products!: Product;

  constructor(
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

  // addToCart(data: any) {
  //   console.log(data);
  //   CartUtil.addItem(
  //     data._id,
  //     data.title,
  //     1,
  //     data.price
  //   )
  //   this.toastr.success(`${data.title} adicionado ao carrinho`, 'Produto Adicionado');
  // }

  ngOnInit() {
    this.products$ = this.data.getProducts();
  }

  resetForm() {
    this.form.reset();
  }

  // listProd() {
  //   this
  //     .service
  //     .getProduct()
  //     .subscribe(
  //       (data: any) => {
  //         this.busy = false;
  //         this.product = data;
  //       })
  // }

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
          this.toastr.success(data.message, 'Produto cadastrado');
          this.resetForm();
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
          this.toastr.success(data.message, 'Produto atualizado');
          this.resetForm();
          console.log(this.form.value);
        },
        error: (err: any) => {
          console.log(err);
          this.busy = false;
        }
      }
      );
    // this.refresh();
  }

  delete(id: any) {
    this
      .service
      .delProd(id)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.toastr.success(data.message);
          console.log(data);
        },
        (err: any) => {
          this.toastr.error(err.message);
          this.busy = false;
          console.log(err);
        }

      );
    this.refresh();
  }

  // search() {
  //   if (this.name == "") {
  //     this.ngOnInit();
  //   } else {
  //     this.product = this.product.filter(res => {
  //       return res.title.toLocaleLowerCase().match(this.name.toLocaleLowerCase());
  //     })
  //   }
  // }
}
