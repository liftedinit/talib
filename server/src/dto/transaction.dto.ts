export class TransactionSimpleDto {
  hash: string;
  request: string;
  response: string;
}

export class TransactionDto extends TransactionSimpleDto {
  blockHash: string;
  blockHeight: number;
  blockIndex: number;
  dateTime: string;
}
