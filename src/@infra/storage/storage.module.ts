import { StorageUploader } from '@/@core/application/users/storage/uploader'
import { Module } from '@nestjs/common'
import { EnvModule } from '../config/env/env.module'
import { FirebaseBannerUploader } from './firebase/banner-uploader'
import { FirebaseService } from './firebase/firebase.service'

@Module({
  imports: [EnvModule],
  providers: [
    FirebaseService,
    {
      provide: StorageUploader,
      useClass: FirebaseBannerUploader,
    },
  ],
  exports: [StorageUploader],
})
export class StorageModule {}
