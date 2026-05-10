import { Observable } from "rxjs";

export interface PopupButtonInitialize {
  text?: string;
  role?: string;
  size?: string;
  disabled?: boolean;
  callback?: (arg?: any) => void;
  callback$?: Observable<any>;
}
