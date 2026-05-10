import { PopupButtonInitialize } from "./popup-button-initialize";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

export class PopupButton implements PopupButtonInitialize {
  public text?: string;
  public role?: string;
  public size?: string;
  public loading?: boolean;
  public disabled?: boolean;
  public callback?: (arg?: any) => void;
  public callback$?: Observable<any>;
  public innerCommand?: (arg?: any) => any;
  public resolve?: (arg?: any) => any;

  constructor(data: PopupButtonInitialize, innerCommand?: (...args: any[]) => any) {
    this.text = data.text;
    this.role = data.role;
    this.size = data.size;
    this.disabled = data.disabled;
    this.callback$ = data.callback$;
    this.callback = data.callback;
    this.innerCommand = (e?: any) => innerCommand(this, e);
  }

  public get command(): (arg?: any) => any {
    return (e?: any) => {
      if (this.callback$) {
        this.loading = true;
        this.callback$.pipe(take(1)).subscribe({
          next: () => {
            this.loading = false;
            this.innerCommand(e);
          },
          error: () => (this.loading = false)
        });
        return;
      } else if (this.innerCommand) {
        this.innerCommand(e);
      } else if (this.callback) {
        this.callback();
      }
      if (this.resolve) {
        this.resolve();
      }
    };
  }
}
