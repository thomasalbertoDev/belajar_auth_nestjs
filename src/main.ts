import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hanya menerima properti yang terdapat di DTO,
      forbidNonWhitelisted: true, // Menolak properti yang tidak diizinkan di DTO
      transform: true, // Mengubah payload menjadi object DTO secara otomatis
    }),
  );

  await app.listen(3000);
}
bootstrap();
