import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
//This guard uses the local strategy (local), which is defined in the local.strategy.ts file.
//The local strategy uses the email and password fields to authenticate the user.
