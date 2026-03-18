import { Role } from './role.enum';
export interface User {
  id: number;
  name: any;
  email: string;
  password: string;
  googleId: any;
  facebookId: any;
  role: Role;
  isBlocked: boolean;
  salesforceId: string;
}

export interface SalesforceDto {
  companyName: string;
  name: string;
  email: string;
}