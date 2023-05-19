import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/account/login-page/login-page.component';
import { FramePageComponent } from './pages/master/frame-page';
import { ProductsPageComponent } from './pages/store/products-page/products-page.component';
import { NewUserPageComponent } from './pages/account/new-user-page/new-user-page.component';
import { SalePageComponent } from './pages/store/sale-page/sale-page.component';
import { SalesPageComponent } from './pages/features/sales-page/sales-page.component';
import { EntranceAndExitComponent } from './pages/features/entrance-and-exit/entrance-and-exit.component';
import { InvoicingPageComponent } from './pages/features/invoicing-page/invoicing-page.component';
import { ExitsPageComponent } from './pages/features/exits-page/exits-page.component';
import { DetailsPageComponent } from './pages/features/details-page/details-page.component';
import { ProducRegistrationPageComponent } from './pages/store/produc-registration-page/produc-registration-page.component';
import { AuthService } from './services/auth.service';
import { PasswordChangePageComponent } from './pages/account/password-change-page/password-change-page.component';

const routes: Routes = [
  // { path: 'teste', component: ProducRegistrationPageComponent },

  {
    path: '', component: LoginPageComponent
  },
  {
    path: 'store',
    component: FramePageComponent,
    children: [
      { path: '', component: ProductsPageComponent, canActivate: [AuthService] },
    ]
  },
  {
    path: 'sale',
    component: FramePageComponent,
    children: [
      { path: '', component: SalePageComponent, canActivate: [AuthService] },
    ]
  },
  {
    path: 'account',
    component: FramePageComponent,
    children: [
      { path: 'new-user', component: NewUserPageComponent, canActivate: [AuthService] },
      { path: 'passwordChage', component: PasswordChangePageComponent, canActivate: [AuthService] },
    ]
  },
  {
    path: 'features',
    component: FramePageComponent,
    children: [
      { path: 'sales', component: SalesPageComponent, canActivate: [AuthService] },
      { path: 'entranceAndExit', component: EntranceAndExitComponent, canActivate: [AuthService] },
      { path: 'invoicing', component: InvoicingPageComponent, canActivate: [AuthService] },
      { path: 'exits', component: ExitsPageComponent, canActivate: [AuthService] },
      { path: 'details', component: DetailsPageComponent, canActivate: [AuthService] },
    ]
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
