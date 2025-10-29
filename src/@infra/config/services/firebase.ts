import { initializeApp } from 'firebase/app'
import { getStorage, ref } from 'firebase/storage'
import { env } from '../env/env'

const firebaseApp = initializeApp({
  apiKey: env.FIREBASE_API_KEY,
  appId: env.FIREBASE_APP_ID,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
})

const storage = getStorage(firebaseApp)

export const bannersRef = ref(storage, 'images')
export const profilesRef = ref(storage, 'profiles')
