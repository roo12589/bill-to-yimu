import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [BillModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
