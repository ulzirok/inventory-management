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
}