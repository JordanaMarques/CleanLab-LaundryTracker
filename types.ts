
export interface OrderRecord {
  id: string;
  date: string;
  customerName: string;
  address: string;
  orderNumber: string;
  weight: string;
  laundryService: string;
  
  // Financials
  clientTotalPaid: string;
  shippingPrice: string;
  payoutDate: string;
  shopifyPayout: string;
  shopifyFee: string;
  discountAmount: string;
  discountPercentage: string;
  
  // Deductions
  washDeductionKgs: string;
  othersDeduction: string;
  totalDeduction: string;
  
  // Item Details
  itemQuantity: string;
  itemDescription: string;
}

export interface ExtractionResponse {
  orders: OrderRecord[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
