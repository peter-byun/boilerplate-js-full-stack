import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { Link } from '../entities/link.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Link])],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
