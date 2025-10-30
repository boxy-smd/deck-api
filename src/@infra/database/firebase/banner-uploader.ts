import { FirebaseStorageUploader } from './storage-uploader'
import type { FirebaseService } from './firebase.service'

export class FirebaseBannerUploader extends FirebaseStorageUploader {
  constructor(firebaseService: FirebaseService) {
    super(firebaseService.getBannersRef())
  }
}
