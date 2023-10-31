import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  private dataCollection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore,) {
    this.dataCollection = this.firestore.collection('results');
  }

  saveResults(formData: any) {
    return this.firestore.collection('results').add({
      username: formData.username,
      email: formData.email,
      points: formData.points,
      correctAnswers: formData.correctAnswers,
      wrongAnswers: formData.wrongAnswers,
      questionAttempted: formData.questionAttempted,
      results: formData.results,
      time: formData.time
    });
  }

  getUserResults(email: string): Observable<any[]> {
    const resultsCollection: AngularFirestoreCollection<any> = this.firestore.collection('results', ref =>
      ref.where('email', '==', email)
    );
  
    return resultsCollection.valueChanges();
  }
  
}
