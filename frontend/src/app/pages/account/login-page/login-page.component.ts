import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { Security } from 'src/app/utils/Security.util';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  public form: FormGroup;
  public busy = false;

  constructor(
    private router: Router,
    private service: DataService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  ngOnInit(): void {

    const token = Security.getToken();
    if (token) {
      this.busy = true;
      this
        .service
        .refreshToken()
        .subscribe(
          (data: any) => {
            this.busy = false;
            this.setUser(data.user, data.token);
          },
          (err) => {
            this.toastr.error(err.error.message);
            localStorage.clear();
            this.busy = false;
          }
        );
    }
  }
  submit() {
    this.busy = true;
    this
      .service
      .authenticate(this.form.value)
      .subscribe(
        (data: any) => {
          this.busy = false;
          this.setUser(data.user, data.token);
        },
        (err) => {
          console.log(err);
          this.busy = false;
        }
      );
  }
  setUser(user: any, token: any) {
    Security.set(user, token);
    this.router.navigate(['/store']);
  }
}
