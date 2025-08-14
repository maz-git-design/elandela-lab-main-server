import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(readonly userService: UserService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Access the user from the request object
    const { userId } = request.session || {};

    if (userId) {
      // Use the user ID to fetch the user from the database
      const user = this.userService.findOne(userId);
      request.currentUser = user;
    }
    // If data is provided, return the specific property, otherwise return the whole user object
    return next.handle();
  }
}
