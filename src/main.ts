import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, PrismaExceptionFilter, UncaughtExceptionFilter, ZodExceptionFilter } from './exceptions/exception';
import { LoggingInterceptor } from './modules/interceptor/logging.interceptor';
import { ResponseInterceptor } from './modules/interceptor/response.interceptor';

(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor(),
                            new ResponseInterceptor())
  app.useGlobalFilters(
      new UncaughtExceptionFilter(),
      new HttpExceptionFilter(),
      new ZodExceptionFilter(),
      new PrismaExceptionFilter(),
    );

  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
