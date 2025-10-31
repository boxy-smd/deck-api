import { Injectable } from '@nestjs/common'
import { FirebaseService } from './firebase.service'
import { FirebaseStorageUploader } from './storage-uploader'

@Injectable()
export class FirebaseBannerUploader extends FirebaseStorageUploader {
  constructor(firebaseService: FirebaseService) {
    super(firebaseService.getBannersRef())
  }
}
