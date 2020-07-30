import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Note } from './models'
import { AngularFirestore } from '@angular/fire/firestore'

const Collections = {
  Notes: 'notes',
  Files: 'files',
}

@Injectable({
  providedIn: 'root',
})
export class AppFireService {
  data$ = this.fire.collection(Collections.Notes).valueChanges() as Observable<
    Note[]
  >
  fileRefs$ = this.fire
    .collection(Collections.Files)
    .valueChanges() as Observable<{ ref: string }[]>
  constructor(private readonly fire: AngularFirestore) {}

  addFile = (fileName: string) =>
    this.fire.collection(Collections.Files).add({ ref: fileName })
}
