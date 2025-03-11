import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
//This decorator allows you to specify required roles for routes.
//It can be used to protect routes that require specific roles.