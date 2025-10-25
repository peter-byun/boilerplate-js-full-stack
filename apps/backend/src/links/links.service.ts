import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { CreateLinkDto, UpdateLinkDto } from '@repo/api';
import { Link } from '../entities/link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: EntityRepository<Link>,
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<Link> {
    const link = this.linkRepository.create({
      url: createLinkDto.url,
      title: createLinkDto.title,
      description: createLinkDto.description,
    });
    await this.linkRepository.getEntityManager().flush();
    return link;
  }

  async findAll(): Promise<Link[]> {
    return await this.linkRepository.findAll();
  }

  async findOne(id: number): Promise<Link> {
    return await this.linkRepository.findOneOrFail(id);
  }

  async update(id: number, updateLinkDto: UpdateLinkDto): Promise<Link> {
    const link = await this.linkRepository.findOneOrFail(id);
    if (updateLinkDto.url !== undefined) {
      link.url = updateLinkDto.url;
    }
    if (updateLinkDto.title !== undefined) {
      link.title = updateLinkDto.title;
    }
    if (updateLinkDto.description !== undefined) {
      link.description = updateLinkDto.description;
    }
    await this.linkRepository.getEntityManager().flush();
    return link;
  }

  async remove(id: number): Promise<Link> {
    const link = await this.linkRepository.findOneOrFail(id);
    await this.linkRepository.getEntityManager().remove(link).flush();
    return link;
  }
}
