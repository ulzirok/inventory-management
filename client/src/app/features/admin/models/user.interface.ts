export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  salesforceId: string;
}
export interface UserDto {
  ids: number[];
  role?: string;
  isBlocked?: boolean;
}