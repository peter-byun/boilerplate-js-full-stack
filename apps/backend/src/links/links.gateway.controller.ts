import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateLinkDto, UpdateLinkDto } from '@repo/api';

@Controller('links')
export class LinksGatewayController {
  constructor(
    @Inject('WORKER_SERVICE') private readonly workerClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createLinkDto: CreateLinkDto) {
    return await firstValueFrom(
      this.workerClient.send('links.create', createLinkDto),
    );
  }

  @Get()
  async findAll() {
    return await firstValueFrom(this.workerClient.send('links.findAll', {}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await firstValueFrom(
      this.workerClient.send('links.findOne', { id: +id }),
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return await firstValueFrom(
      this.workerClient.send('links.update', { id: +id, ...updateLinkDto }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await firstValueFrom(
      this.workerClient.send('links.remove', { id: +id }),
    );
  }
}
