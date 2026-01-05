import { Injectable } from '@nestjs/common'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { EnvService } from '@/@infra/config/env/env.service'

@Injectable()
export class SupabaseService {
  public readonly client: SupabaseClient

  constructor(config: EnvService) {
    this.client = createClient(
      config.get('SUPABASE_URL'),
      config.get('SUPABASE_SERVICE_ROLE_KEY'),
    )
  }
}
