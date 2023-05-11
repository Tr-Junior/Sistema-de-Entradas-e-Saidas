import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Security } from 'src/app/utils/Security.util';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public user!: User;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.user = Security.getUser();
  }

  logout() {
    Security.clear();
    this.router.navigate(['/']);
  }
}
