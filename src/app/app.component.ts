import { Component } from "@angular/core"
import { Observable, of } from "rxjs"
import { AngularFireAuth } from "@angular/fire/auth"
import { auth } from "firebase/app"
import { AngularFireStorage } from "@angular/fire/storage"
import { AppFireService } from "./app-fire.service"
import { filter, switchMap } from "rxjs/operators"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  error: string
  user$ = this.auth.user
  uploadPercent$: Observable<number | undefined>
  currentTrack$: Observable<string> = this.fire.state$.pipe(
    filter(x => x && x.currentTrack !== undefined),
    switchMap(({ currentTrack }) =>
      currentTrack === 'pause' ? of(currentTrack) : this.storage.ref(currentTrack).getDownloadURL()
    )
  )

  constructor(
    readonly fire: AppFireService,
    private readonly auth: AngularFireAuth,
    private readonly storage: AngularFireStorage
  ) {}

  login() {
    this.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .catch(e => console.error(e))
  }
  logout() {
    this.auth.signOut().then(_ => console.log('Signed out!'))
  }

  title = 'dnd-notes'

  uploadFile(e) {
    const file = e.target.files[0]
    this.fire
      .addTrack(file.name)
      .then(_ => console.log(`Added ${file.name}`))
      .catch(e => console.error(e))
    this.uploadPercent$ = this.storage
      .upload(file.name, file)
      .percentageChanges()
  }

  setCurrentTrack({ ref: currentTrack }) {
    this.fire.updateState({currentTrack})
      .catch(console.error)
  }

  stopMusic() {
    this.fire.updateState({currentTrack: 'pause'})
  }
}
