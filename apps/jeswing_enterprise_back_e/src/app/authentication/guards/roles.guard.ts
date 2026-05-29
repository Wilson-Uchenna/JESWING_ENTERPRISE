import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../../../generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    console.log('RolesGuard requiredRoles:', requiredRoles);
    
    // 👇 if no roles are required, allow access
    if (!requiredRoles) return true;

    // 👇 extract user from GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    console.log('RolesGuard user:', user);

    // 👇 if no user on request, deny access
    if (!user) return false;

    console.log('role match:', requiredRoles.includes(user.role));
    return requiredRoles.includes(user.role);
  }
}