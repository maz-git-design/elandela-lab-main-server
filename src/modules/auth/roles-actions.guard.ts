import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export interface PermissionRequirement {
  module: string;
  action: string;
}

@Injectable()
export class RolesActionsGuard implements CanActivate {
  constructor(readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions: PermissionRequirement[] =
      this.reflector.get<PermissionRequirement[]>(
        'permissions',
        context.getHandler(),
      ) || [];
    const req: Request = context.switchToHttp().getRequest();
    // Use type assertion to access user property
    const user = (req as any).user;
    if (!user) throw new ForbiddenException('No user in session');
    // Collect user's permissions from roles and customPermissions
    const userPermissions = new Set<string>();
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((role: any) => {
        if (role.permissions && Array.isArray(role.permissions)) {
          role.permissions.forEach((perm: any) =>
            userPermissions.add(perm.name),
          );
        }
      });
    }
    if (user.customPermissions && Array.isArray(user.customPermissions)) {
      user.customPermissions.forEach((perm: any) =>
        userPermissions.add(perm.name),
      );
    }
    // Check if user has all required permissions
    for (const perm of requiredPermissions) {
      const permName = `${perm.action}_${perm.module}`;
      if (!userPermissions.has(permName)) {
        throw new ForbiddenException(`Missing permission: ${permName}`);
      }
    }
    return true;
  }
}
