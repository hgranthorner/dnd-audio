import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Note, State } from './models'
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore'

const Collections = {
  Notes: 'notes',
  Tracks: 'tracks',
  State: 'state',
}

@Injectable({
  providedIn: 'root',
})
export class AppFireService {
  private readonly state = this.fire
    .collection(Collections.State)
    .doc('state') as AngularFirestoreDocument<State>
  tracks$ = this.fire
    .collection(Collections.Tracks)
    .valueChanges() as Observable<{ ref: string }[]>
  data$ = this.fire.collection(Collections.Notes).valueChanges() as Observable<
    Note[]
  >
  state$ = this.state.valueChanges()
  constructor(private readonly fire: AngularFirestore) {}

  addTrack = (fileName: string) =>
    this.fire.collection(Collections.Tracks).add({ ref: fileName })
  updateState = (newState: Partial<State>) => this.state.update(newState)
}
