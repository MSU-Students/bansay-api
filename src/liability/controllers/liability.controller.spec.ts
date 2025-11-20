import { Test, TestingModule } from '@nestjs/testing';
import { LiabilityController } from '@bansay/liability/controllers/liability.controller';
import { LiabilityService } from '@bansay/liability/services/liability.service';

describe('LiabilityController', () => {
  let controller: LiabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiabilityController],
      providers: [LiabilityService],
    }).compile();

    controller = module.get<LiabilityController>(LiabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
