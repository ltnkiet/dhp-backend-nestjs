import { Type } from 'class-transformer';
import { IsOptional, IsString, Max, Min } from 'class-validator';
import * as dayjs from 'dayjs';

import { BadRequestException } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDTO {
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 0,
  })
  offset?: number;

  @Min(1)
  @Max(200)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 20,
  })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '-createdAt',
  })
  sort?: string;

  protected _filter: Record<string, any> = {};

  protected parseFilters() {}

  public get filter(): Record<string, any> {
    this.parseFilters();

    return this._filter;
  }

  public addFilter(newFilter: Record<string, any>): void {
    this._filter = Object.assign(this._filter, newFilter);
  }
}

export class PaginatedDateTimeDTO extends PaginationDTO {
  protected parseFilters(): void {
    super.parseFilters();

    if (this.fromDate && !dayjs(this.fromDate).isValid()) {
      throw new BadRequestException('invalid format for from date');
    }

    if (this.toDate && !dayjs(this.toDate).isValid()) {
      throw new BadRequestException('invalid format for to date');
    }

    if (this.fromDate && this.toDate) {
      if (dayjs(this.fromDate).isAfter(dayjs(this.toDate))) {
        throw new BadRequestException('from date must be before to date');
      }
    }

    if (this.fromDate && this.toDate) {
      this.addFilter({
        createdAt: {
          $gte: dayjs(this.fromDate).toDate(),
          $lte: dayjs(this.toDate).endOf('day').toDate(),
        },
      });
    } else if (this.fromDate) {
      this.addFilter({
        createdAt: {
          $gte: dayjs(this.fromDate).toDate(),
        },
      });
    } else if (this.toDate) {
      this.addFilter({
        createdAt: {
          $lte: dayjs(this.toDate).endOf('day').toDate(),
        },
      });
    }
  }

  @ApiPropertyOptional({
    description: 'the start date of the report',
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'the end date of the report',
  })
  @IsOptional()
  @IsString()
  toDate?: string;
}
