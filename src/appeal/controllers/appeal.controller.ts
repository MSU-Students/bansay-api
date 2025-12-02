import { Controller } from '@nestjs/common';
import { AppealService } from '../services/appeal.service';

@Controller('appeal')
export class AppealController {
  constructor(private readonly appealService: AppealService) {}
}
