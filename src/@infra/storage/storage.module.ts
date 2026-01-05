import { Module } from '@nestjs/common'
import { StorageUploader } from '@/@core/application/users/storage/uploader'
import { EnvModule } from '../config/env/env.module'
import { EnvService } from '../config/env/env.service'
import { SupabaseStorageUploader } from './supabase/storage-uploader'
import { SupabaseService } from './supabase/supabase.service'

@Module({
  imports: [EnvModule],
  providers: [
    SupabaseService,
    {
      provide: StorageUploader,
      inject: [SupabaseService, EnvService],
      useFactory: (supabase: SupabaseService, config: EnvService) => {
        return new SupabaseStorageUploader(supabase, config)
      },
    },
  ],
  exports: [StorageUploader],
})
export class StorageModule {}
