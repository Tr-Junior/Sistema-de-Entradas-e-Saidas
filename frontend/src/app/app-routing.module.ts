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

const routes: Routes = [
  // { path: '', component: ProducRegistrationPageComponent },

  {
    path: '', component: LoginPageComponent
  },
  {
    path: '',
    component: FramePageComponent,
    children: [
      { path: 'store', component: ProductsPageComponent, canActivate: [AuthService] },
      { path: 'sale', component: SalePageComponent, canActivate: [AuthService] },

    ]
  },
  {
    path: 'account',
    component: FramePageComponent,
    children: [
      { path: '', component: NewUserPageComponent, canActivate: [AuthService] },
    ]
  },
  {
    path: 'features',
    component: FramePageComponent,
    children: [
      { path: '', component: SalesPageComponent, canActivate: [AuthService] },
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
