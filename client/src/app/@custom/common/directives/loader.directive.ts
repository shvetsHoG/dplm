import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  signal,
  WritableSignal,
  effect
} from "@angular/core";
import { BehaviorSubject, Subject, combineLatest, Subscription } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Directive({
  selector: "[customLoader]",
  standalone: false
})
export class LoaderDirective implements OnChanges, OnInit, OnDestroy {
  private readonly SPINNER_CLASS = "spinner";
  private readonly SPINNER_ACTIVE_CLASS = "spinner-active";
  private _isLoading$: BehaviorSubject<any>;
  private _isLoading: WritableSignal<boolean> = signal(undefined);
  private _isPostLoading$: Subject<boolean>;
  private _destroy$ = new Subject();

  @Input("customLoaderPost") set appLoaderPost(value: Subject<boolean>) {
    this._isPostLoading$ = value;
  }

  @Input("customLoader") set appLoader(value: BehaviorSubject<boolean> | boolean) {
    value instanceof BehaviorSubject ? (this._isLoading$ = value) : this._isLoading.set(value);
  }

  private _subs: Subscription;

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2
  ) {
    effect(() => {
      this._toggleSpinner(this._isLoading());
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const val = changes.appLoader?.currentValue;
    if (val && val instanceof BehaviorSubject) {
      this._createSubscribe();
    }
  }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this.SPINNER_CLASS);
  }

  ngOnDestroy() {
    this._destroy$.next(null);
  }

  private _createSubscribe(): void {
    if (this._subs) {
      this._subs.unsubscribe();
      this._subs = null;
    }

    const obs = this._isLoading$.pipe(
      map((data) => {
        if (data instanceof HttpErrorResponse) {
          return false;
        }
        return data;
      }),
      takeUntil(this._destroy$)
    );

    if (this._isPostLoading$) {
      combineLatest([obs, this._isPostLoading$])
        .pipe(
          map((data) => {
            if (data[0] && data[1]) {
              return true;
            }
            if (!data[0] && !data[1]) {
              return false;
            }
            return;
          })
        )
        .subscribe(
          (bool) => this._toggleSpinner(bool),
          () => this._toggleSpinner(false)
        );
    } else {
      this._subs = obs.subscribe(
        (bool) => this._toggleSpinner(bool),
        () => this._toggleSpinner(false)
      );
    }
  }

  private _toggleSpinner(isLoading: boolean): void {
    if (isLoading === undefined) {
      return;
    }

    if (isLoading) {
      this._renderer.addClass(this._el.nativeElement, this.SPINNER_ACTIVE_CLASS);
    } else {
      this._renderer.removeClass(this._el.nativeElement, this.SPINNER_ACTIVE_CLASS);
    }
  }
}
