import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user/user-service.service';
import { LoginServiceService } from '../services/login/login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserServiceService, private login: LoginServiceService, private router: Router, private cdr: ChangeDetectorRef) { }

  isLoggedin: boolean = false;
  username: string = "";
  isNavActive = false;

  ngOnInit(): void {
    const userDetails = this.login.getUserDetailsFromSessionStorage();
    console.log(userDetails);
    if (userDetails !== null) {
      this.userService.setUser(userDetails);
      this.username = userDetails.name;
      console.log(this.username);
      this.isLoggedin = true;
      this.login.isLoggedInSubject.next(true);
      this.cdr.detectChanges();

    }
    if (this.isLoggedin) {
      this.login.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedin = isLoggedIn;
      });
    }


  }

  logout() {
    this.isLoggedin = false;
    this.login.logoutUser();
    this.router.navigate(['/home']);
  }


  isMenuActive = false;

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const screenWidth = window.innerWidth;
    if (screenWidth < 770) {
      this.isMenuActive = true;
    }
    if (screenWidth > 770) {
      this.isMenuActive = false;
    }
  }

}
