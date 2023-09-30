import {
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';

const logger = new Logger('AWS_EXCEPTION_LOG');

const handleAwsException = (error: any) => {
  logger.error(error);
  switch (error.name) {
    case 'ValidationException':
      throw new BadRequestException(`Validation error: ${error.message}`);
    case 'ConditionalCheckFailedException':
      throw new BadRequestException(
        `Conditional check failed: ${error.message}`,
      );
    case 'ExpiredTokenException':
      throw new BadRequestException(`Token expired: ${error.message}`);
    case 'ResourceNotFoundException':
      throw new BadRequestException(`Resource not found: ${error.message}`);
    case 'ProvisionedThroughputExceededException':
      throw new BadRequestException(
        `Provisioned throughput exceeded: ${error.message}`,
      );
    case 'InternalServerError':
      throw new InternalServerErrorException(
        `Internal server error: ${error.name} - ${error.message}`,
      );
    case 'ItemCollectionSizeLimitExceededException':
      throw new BadRequestException(
        `Item collection size limit exceeded: ${error.message}`,
      );
    case 'LimitExceededException':
      throw new BadRequestException(`Limit exceeded: ${error.message}`);
    case 'TransactionCanceledException':
      throw new BadRequestException(`Transaction canceled: ${error.message}`);
    case 'AccessDeniedException':
      throw new ForbiddenException(`Access denied: ${error.message}`);
    case 'CredentialsProviderError':
      throw new BadRequestException(
        `Credentials provider error: ${error.message}`,
      );
    default:
      throw new InternalServerErrorException(
        `Unhandled AWS exception: ${error.name} - ${error.message}`,
      );
  }
};

export default handleAwsException;
