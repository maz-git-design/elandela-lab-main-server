import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // Access the user from the request object
    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  },
);
