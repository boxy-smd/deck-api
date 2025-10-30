import { STORAGE_UPLOADER } from '@/@shared/kernel/dependency-tokens'
import { Global, Module } from '@nestjs/common'
import { FirebaseProfileUploader } from './profile-uploader'
import { FirebaseService } from './firebase.service'

@Global()
@Module({
  providers: [
    FirebaseService,
    {
      provide: STORAGE_UPLOADER,
      useFactory: (firebaseService: FirebaseService) => {
        return new FirebaseProfileUploader(firebaseService)
      },
      inject: [FirebaseService],
    },
  ],
  exports: [FirebaseService, STORAGE_UPLOADER],
})
export class FirebaseModule {}
