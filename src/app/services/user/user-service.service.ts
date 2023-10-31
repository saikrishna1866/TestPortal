import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor() { }

  private userData: any;

  setUser(data: { email: string; name: string; mobileNumber: string }) {
    this.userData = data;
  }

  getUser() {
    return this.userData;
  }
}
