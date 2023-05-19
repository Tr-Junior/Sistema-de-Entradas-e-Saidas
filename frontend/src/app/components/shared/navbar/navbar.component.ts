import { Component, HostListener } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Security } from 'src/app/utils/Security.util';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public user!: User;
  items: MenuItem[] = [];

  constructor(
    private router: Router,
  ) {
    this.items = [

      {
        label: 'Lista de Produtos',
        icon: 'pi pi-list',
        command: () => {
          this.router.navigate(['/store']);
        }
      },
      {
        label: 'Caixa',
        icon: 'pi pi-cart-plus',
        command: () => {
          this.router.navigate(['/sale']);
        }
      },
      {
        label: 'Vendas',
        icon: 'pi pi-shopping-cart',
        command: () => {
          this.router.navigate(['/features']);
        }
      },
      {
        label: 'Faturamento',
        icon: 'pi pi-chart-line',
        command: () => {
          this.router.navigate(['/features/entranceAndExit']);
        }
      },
      {
        label: 'Cadastro de usuário',
        icon: 'pi pi-user-plus',
        command: () => {
          this.router.navigate(['/account']);
        }
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];
  }

  ngOnInit(): void {
    this.user = Security.getUser();
  }

  logout() {
    Security.clear();
    this.router.navigate(['/']);
  }


}
