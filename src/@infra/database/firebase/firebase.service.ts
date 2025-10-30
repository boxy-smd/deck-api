import { env } from '@/@infra/config/env/env'
import { Injectable } from '@nestjs/common'
import { initializeApp } from 'firebase/app'
import {
  type FirebaseStorage,
  type StorageReference,
  getStorage,
  ref,
} from 'firebase/storage'

@Injectable()
export class FirebaseService {
  private readonly storage: FirebaseStorage

  constructor() {
    const firebaseApp = initializeApp({
      apiKey: env.FIREBASE_API_KEY,
      appId: env.FIREBASE_APP_ID,
      authDomain: env.FIREBASE_AUTH_DOMAIN,
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
    })

    this.storage = getStorage(firebaseApp)
  }

  getBannersRef(): StorageReference {
    return ref(this.storage, 'images')
  }

  getProfilesRef(): StorageReference {
    return ref(this.storage, 'profiles')
  }

  getStorageRef(path: string): StorageReference {
    return ref(this.storage, path)
  }
}
