import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LinksService } from './links.service';
import { CreateLinkDto, UpdateLinkDto } from '@repo/api';

@Controller()
export class LinksWorkerController {
  constructor(private readonly linksService: LinksService) {}

  @MessagePattern('links.create')
  async create(@Payload() createLinkDto: CreateLinkDto) {
    return await this.linksService.create(createLinkDto);
  }

  @MessagePattern('links.findAll')
  async findAll() {
    return await this.linksService.findAll();
  }

  @MessagePattern('links.findOne')
  async findOne(@Payload() data: { id: number }) {
    return await this.linksService.findOne(data.id);
  }

  @MessagePattern('links.update')
  async update(@Payload() data: { id: number } & UpdateLinkDto) {
    const { id, ...updateLinkDto } = data;
    return await this.linksService.update(id, updateLinkDto);
  }

  @MessagePattern('links.remove')
  async remove(@Payload() data: { id: number }) {
    return await this.linksService.remove(data.id);
  }
}
