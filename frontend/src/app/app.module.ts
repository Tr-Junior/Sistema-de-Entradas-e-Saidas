import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import ptBR from '@angular/common/locales/pt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginPageComponent } from './pages/account/login-page/login-page.component';
import { NewUserPageComponent } from './pages/account/new-user-page/new-user-page.component';
import { ProductsPageComponent } from './pages/store/products-page/products-page.component';
import { SalePageComponent } from './pages/store/sale-page/sale-page.component';
import { EntranceAndExitComponent } from './pages/features/entrance-and-exit/entrance-and-exit.component';
import { InvoicingPageComponent } from './pages/features/invoicing-page/invoicing-page.component';
import { SalesPageComponent } from './pages/features/sales-page/sales-page.component';
import { ExitsPageComponent } from './pages/features/exits-page/exits-page.component';
import { DetailsPageComponent } from './pages/features/details-page/details-page.component';
import { FramePageComponent } from './pages/master/frame-page';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from 'ng2-currency-mask';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { ProductCardComponent } from './components/store/product-card/product-card.component';
import { registerLocaleData, DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { ProducRegistrationPageComponent } from './pages/store/produc-registration-page/produc-registration-page.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MenubarModule } from 'primeng/menubar';
import { CalendarModule } from 'primeng/calendar';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { AuthService } from './services/auth.service';

registerLocaleData(ptBR);

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginPageComponent,
    NewUserPageComponent,
    ProductsPageComponent,
    SalePageComponent,
    EntranceAndExitComponent,
    InvoicingPageComponent,
    SalesPageComponent,
    ExitsPageComponent,
    FramePageComponent,
    LoadingComponent,
    DetailsPageComponent,
    ProductCardComponent,
    ProducRegistrationPageComponent

  ],
  imports: [
    ButtonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    CurrencyMaskModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
    CalendarModule,
    DataViewModule,
    TagModule,
    CardModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    InputNumberModule,
    InputTextModule,
    ConfirmDialogModule,
    PasswordModule,
    DropdownModule,
    MessagesModule,
    MenubarModule
  ],
  providers: [DataService, AuthService, ConfirmationService, MessageService, DatePipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {

  }
}


