import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { UserServiceService } from '../user/user-service.service';
import { take, switchMap, } from 'rxjs/operators';
import { from, } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  isLoggedIn: boolean = false;
  user: any;

  private dataCollection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore, private userService: UserServiceService) {
    this.dataCollection = this.firestore.collection('users');
    this.initializeLoginStatus();
  }

  private initializeLoginStatus() {
    const userData = this.userService.getUser();
    this.user = userData;
    this.isLoggedIn = userData !== null;
    this.isLoggedInSubject.next(this.isLoggedIn);
  }

  register(formData: any) {
    return this.dataCollection.add(formData);
  }

  getAllFormData(): Observable<any[]> {
    return this.dataCollection.valueChanges();
  }

  // validateUser(email: string, password: string): Observable<boolean> {
  //   const userDoc: AngularFirestoreDocument<any> = this.firestore.doc(`users/${email}`);
  //   return userDoc.valueChanges().pipe(
  //     tap(userData => {
  //       console.log('User Data:', userData);
  //       console.log('Entered Password:', password);
  //     }),
  //     map(userData => {
  //       if (userData && userData.password === password) {
  //         return true; // User is valid
  //       }
  //       return false; // Invalid user
  //     })
  //   );
  // }

  validateUser(email: string, password: string): Observable<boolean> {
    const userCollection: AngularFirestoreCollection<any> = this.firestore.collection('users', ref =>
      ref.where('email', '==', email)
    );

    return userCollection.valueChanges().pipe(
      map(users => {
        if (users.length === 1 && users[0].password === password) {
          const { email, name, mobileNumber } = users[0];
          this.userService.setUser({ email, name, mobileNumber });

          sessionStorage.setItem('userDetails', JSON.stringify({ email, name, mobileNumber }));
          this.isLoggedIn = true;
          this.isLoggedInSubject.next(true);

          this.isLoggedIn = true;
          this.isLoggedInSubject.next(true);
          return true;
        }
        return false;
      })
    );
  }

  getUserDetailsFromSessionStorage() {
    const userDetails = sessionStorage.getItem('userDetails');
    return userDetails ? JSON.parse(userDetails) : null;
  }

  logoutUser(): void {
    this.isLoggedIn = false;
    this.isLoggedInSubject.next(false);
    sessionStorage.removeItem('userDetails');
  }

  resetPassword(email: string, newPassword: string, newConfirmPassword: string): Observable<boolean> {
    const userCollection: AngularFirestoreCollection<any> = this.firestore.collection('users', ref =>
      ref.where('email', '==', email)
    );

    if (newPassword !== newConfirmPassword) {

      return of(false);
    }

    return userCollection.snapshotChanges().pipe(
      take(1),
      switchMap(actions => {
        if (actions.length === 1) {
          const userDoc = userCollection.doc(actions[0].payload.doc.id);
          return from(userDoc.update({ password: newPassword, confirmPassword: newConfirmPassword })).pipe(
            map(() => true),
            catchError(() => of(false))
          );
        }
        return of(false);
      })
    );
  }







}
