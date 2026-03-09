export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}
export interface UserDto {
  ids: number[]
  role?: string;
  isBlocked?: boolean;
}