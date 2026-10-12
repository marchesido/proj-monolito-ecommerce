export interface PaymentEntity {
  id: string;
  orderId: string;
  provider: string;
  status: string;
  payload: any;
  createdAt: Date;
  updatedAt: Date;
}
