import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;  // Use environment variable or default to 3000
  await app.listen(port);  // Start the application on the specified port
  console.log(`Application is running on: http://localhost:${port}`);  // Log the URL
}
bootstrap();
