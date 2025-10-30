import type { FirebaseService } from './firebase.service'
import { FirebaseStorageUploader } from './storage-uploader'

export class FirebaseProfileUploader extends FirebaseStorageUploader {
  constructor(firebaseService: FirebaseService) {
    super(firebaseService.getProfilesRef())
  }
}
