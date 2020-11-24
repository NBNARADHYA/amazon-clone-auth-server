import { User } from "../../entity/User";
import faker from "faker";

interface FakeUser extends Partial<User> {}

export const generateFakeUser = (): FakeUser => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
};
