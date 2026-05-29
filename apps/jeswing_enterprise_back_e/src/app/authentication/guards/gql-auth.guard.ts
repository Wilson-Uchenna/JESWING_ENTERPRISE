import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  // 👇 override this to extract req from GraphQL context
  // REST uses req directly, GraphQL wraps it in a context
  override getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    console.log('GqlAuthGuard req.headers:', req?.headers);
    return ctx.getContext().req;
  }

   override handleRequest<TUser = any>(err: any, user: TUser): TUser {
    console.log('GqlAuthGuard handleRequest user:', user); // ← add temporarily
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
