import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodController } from './neighborhood.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: NeighborhoodController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NeighborhoodController],
      providers: [AppService],
    }).compile();

    appController = app.get<NeighborhoodController>(NeighborhoodController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
