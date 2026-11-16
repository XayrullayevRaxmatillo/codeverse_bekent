import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { z } from 'zod';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { badRequest } from '../../common/errors';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ZodPipe } from '../../common/pipes/zod-validation.pipe';
import { AnyModel, Doc, M } from '../../database/schemas';

const reportBody = z.object({
  targetType: z.enum(['lesson', 'question', 'challenge', 'user', 'other']),
  targetId: z.string().max(64).default(''),
  reason: z.enum(['error', 'unclear', 'offensive', 'bug', 'other']).default('error'),
  message: z.string().trim().max(1000).default(''),
});

@Controller('reports')
export class ReportsController {
  constructor(@InjectModel(M.Report) private readonly reports: AnyModel) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@CurrentUser() user: Doc, @Body(new ZodPipe(reportBody)) body) {
    const open = await this.reports.countDocuments({ user: user._id, status: 'open' });
    if (open >= 20) throw badRequest('TOO_MANY', 'Ochiq shikoyatlaringiz juda ko\'p');
    const report = await this.reports.create({ ...body, user: user._id });
    return { id: String(report._id) }; // 201
  }
}
