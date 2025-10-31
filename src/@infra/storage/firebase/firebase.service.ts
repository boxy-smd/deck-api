import { EnvService } from '@/@infra/config/env/env.service'
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

  constructor(config: EnvService) {
    const firebaseApp = initializeApp({
      apiKey: config.get('FIREBASE_API_KEY'),
      appId: config.get('FIREBASE_APP_ID'),
      authDomain: config.get('FIREBASE_AUTH_DOMAIN'),
      messagingSenderId: config.get('FIREBASE_MESSAGING_SENDER_ID'),
      projectId: config.get('FIREBASE_PROJECT_ID'),
      storageBucket: config.get('FIREBASE_STORAGE_BUCKET'),
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
