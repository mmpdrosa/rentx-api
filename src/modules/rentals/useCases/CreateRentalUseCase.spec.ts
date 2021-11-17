import dayjs from 'dayjs';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { RentalsRepositoryInMemory } from '../repositories/in-memory/RentalsRepositoryInMemory';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let dayjsDateProvider: DayjsDateProvider;
let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe('Create Rental', () => {
  const dayPlus24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it('Should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '1',
      car_id: '1',
      expected_return_date: dayPlus24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('Should not be able to create a new rental if user has a open rental', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '2',
        car_id: '2',
        expected_return_date: dayPlus24Hours,
      });

      await createRentalUseCase.execute({
        user_id: '2',
        car_id: '3',
        expected_return_date: dayPlus24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new rental if car is already rented', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '4',
        car_id: '4',
        expected_return_date: dayPlus24Hours,
      });

      await createRentalUseCase.execute({
        user_id: '5',
        car_id: '4',
        expected_return_date: dayPlus24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new rental if the return date is less than 24 hours', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '6',
        car_id: '5',
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});