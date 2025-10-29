import { env } from '@/@infra/config/env/env'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

interface JwtPayload {
  sub: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    })
  }

  async validate(payload: JwtPayload) {
    return new Promise<{ userId: string; role: string }>(resolve => {
      resolve({ userId: payload.sub, role: payload.role })
    })
  }
}
