import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface CurrentUser {
  id: string;
  email: string;
}

export const extractUserData = (request: { [x: string]: any; }): CurrentUser => {
  const user = request[REQUEST_USER_KEY];

  return {
    id: user.sub,
    email: user.email,
  };
}
export const CurrentUserReq = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
