import * as mime from 'mime-types'
import { StorageUploader } from '@/@core/application/users/storage/uploader'
import { EnvService } from '@/@infra/config/env/env.service'
import { SupabaseService } from './supabase.service'

export class SupabaseStorageUploader implements StorageUploader {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: EnvService,
  ) {}

  async upload(image: Buffer, path: string): Promise<{ downloadUrl: string }> {
    const bucket = this.config.get('SUPABASE_BUCKET')
    const contentType = mime.lookup(path) || 'application/octet-stream'

    const { error } = await this.supabase.client.storage
      .from(bucket)
      .upload(path, image, {
        upsert: true,
        contentType,
      })

    if (error) {
      console.error('Supabase Storage Error:', error)
      const supabaseError = error as {
        status?: string | number
        statusCode?: string | number
        message: string
      }

      if (typeof supabaseError.status === 'string') {
        supabaseError.status = Number.parseInt(supabaseError.status, 10)
      }

      if (typeof supabaseError.statusCode === 'string') {
        supabaseError.statusCode = Number.parseInt(supabaseError.statusCode, 10)
      }
      throw error
    }

    const {
      data: { publicUrl },
    } = this.supabase.client.storage.from(bucket).getPublicUrl(path)

    return {
      downloadUrl: publicUrl,
    }
  }
}
