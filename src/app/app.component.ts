import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { AngularFireStorage } from '@angular/fire/storage'
import { AppFireService } from './app-fire.service'
import { AllowedEmail } from '../secrets'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  error: string
  user$ = this.auth.user.pipe(
    tap(u => {
      if (u && u.email !== AllowedEmail.email) {
        this.auth.signOut()
        this.error =
          'Sorry, incorrect login. Please reach out if you would like to use this!'
      } else {
        this.error = ''
      }
    })
  )
  uploadPercent$: Observable<number | undefined>
  data$ = this.fire.data$
  filesRefs$ = this.fire.fileRefs$
  img$: Observable<string> = this.storage.ref('test').getDownloadURL()
  constructor(
    private readonly fire: AppFireService,
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
      .addFile(file.name)
      .then(_ => console.log(`Added ${file.name}`))
      .catch(e => console.error(e))
    this.uploadPercent$ = this.storage
      .upload(file.name, file)
      .percentageChanges()
  }
}
