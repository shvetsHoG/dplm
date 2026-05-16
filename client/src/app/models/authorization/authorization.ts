import { AccessControlUser } from "app/models/access-control/access-control-user";

export interface AuthForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AccessControlUser;
}
