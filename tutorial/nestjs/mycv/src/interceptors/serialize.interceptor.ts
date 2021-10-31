import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //   RUn something before a request is handled
    // by the request handler
    console.log('running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out.
        console.log('running before response is sent out.');
      }),
    );
  }
}
