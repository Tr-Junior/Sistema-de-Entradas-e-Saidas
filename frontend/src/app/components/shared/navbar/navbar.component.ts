import { Component, HostListener } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Security } from 'src/app/utils/Security.util';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public user!: User;
  items: MenuItem[] = [];
  selectedTheme?: string;
  themes: SelectItem[] = [
    { label: 'Lara Dark Purple', value: 'lara-dark-purple' },
    { label: 'Lara Dark Blue', value: 'lara-dark-blue' },
    { label: 'Soho Dark', value: 'soho-dark' }
  ];

  constructor(
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.user = Security.getUser();
    this.selectedTheme = localStorage.getItem('selectedTheme') || 'lara-dark-purple';

  }

  logout() {
    Security.clear();
    this.router.navigate(['/']);
  }


  changeTheme() {
    localStorage.setItem('selectedTheme', this.selectedTheme!);
    window.location.reload(); // Recarrega a página para aplicar o novo tema
  }


}
