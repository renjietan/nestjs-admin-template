import {
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
  
  // 自定义验证规则
  @ValidatorConstraint({ name: 'IsValidJson', async: false })
  export class IsValidJsonConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
      try {
        if(!!!value) return true
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }
  
    defaultMessage(args: ValidationArguments) {
      return `${args.property} must be a valid JSON string`;
    }
  }
  
  // 在DTO中使用
  class CreateDto {
    @Validate(IsValidJsonConstraint)
    jsonField: string;
  }