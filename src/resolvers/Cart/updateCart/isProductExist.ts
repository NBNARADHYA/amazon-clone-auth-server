import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { getConnection } from "typeorm";
import { Cart } from "../../../entity/Cart";

@ValidatorConstraint({ async: true })
export class IsProductExistConstraint implements ValidatorConstraintInterface {
  validate(productId: string): Promise<boolean> {
    const dbConnection = getConnection();

    return dbConnection
      .getRepository(Cart)
      .findOne({ where: { productId } })
      .then((cart): boolean => !!cart);
  }
}

export function IsProductExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsProductExistConstraint,
    });
  };
}
