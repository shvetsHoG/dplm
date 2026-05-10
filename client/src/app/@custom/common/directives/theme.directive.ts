import { Directive, Optional, Input, ElementRef, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { ThemeService } from "../services/theme.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: "[customTheme]",
  exportAs: "customTheme",
  standalone: false
})
export class ThemeDirective implements OnInit, OnDestroy {
  private _destroy$ = new Subject<void>();

  @Input() customTheme: string;

  constructor(
    @Optional() private _themeService: ThemeService,
    private _renderer: Renderer2,
    private _elementRef: ElementRef
  ) {}

  ngOnInit() {
    this._themeService?.theme$
      .pipe(takeUntil(this._destroy$))
      .subscribe((theme) =>
        this._renderer.setAttribute(this._elementRef.nativeElement, "data-theme", this.customTheme || theme)
      );
  }

  ngOnDestroy() {
    this._destroy$.complete();
    this._destroy$.next(null);
  }
}
