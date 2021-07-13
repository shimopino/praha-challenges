import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostService } from './post.service';
import { PrismaService } from './prisma.service';
import { SampleController } from './sample.controller';
import { UserService } from './user.sservice';

@Module({
  imports: [],
  controllers: [AppController, SampleController],
  providers: [AppService, PrismaService, UserService, PostService],
})
export class AppModule {}
