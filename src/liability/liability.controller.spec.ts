import { Test, TestingModule } from '@nestjs/testing';
import { LiabilityController } from './liability.controller';
import { LiabilityService } from './liability.service';

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
