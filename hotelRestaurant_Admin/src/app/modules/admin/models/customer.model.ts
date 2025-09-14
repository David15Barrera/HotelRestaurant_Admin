export interface Customer {
  id?: string; // opcional para POST
  fullName: string;
  cui: string;
  phone: string;
  email: string;
  address: string;
  loyaltyPoints: number;
}
