export interface AuthForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
