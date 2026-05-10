import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";
import { TimeIntervalService } from "@custom/common/services/time-interval.service";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "custom-time-interval",
    templateUrl: "./time-interval.component.html",
    styleUrls: ["./time-interval.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TimeIntervalComponent implements OnInit, OnDestroy, OnChanges {
  public value: number;

  @Output() timeCheck = new EventEmitter<boolean>();
  @Output() valueChanges = new EventEmitter<any>();

  @Input() numberUpdate: number;
  @Input() date: Date;
  @Input() format = "hh:mm";
  @Input() interval = 1000 * 60;
  @Input() direction: "from" | "to" = "from";
  @Input() placeholder: string;
  @Input() vertical: boolean = false;
  @Input() checkMinut: number;
  @Input() timer: number;
  @Input() needAttention: boolean;

  public isAttention: boolean;

  private fn: () => number;
  private _destroy$ = new Subject();
  private _intervalSubs: Subscription;

  get val(): string | string[] {
    const diff = this.fn();
    const val: string[] = [];

    if (diff >= 0) {
      if (/hh/.test(this.format)) {
        val.push(this.valToStr(Math.abs(Math.floor(diff / 1000 / 60 / 60))));
      }
      if (/mm/.test(this.format)) {
        val.push(this.valToStr(Math.abs(Math.floor((diff / 1000 / 60) % 60))));
      }
      if (/ss/.test(this.format)) {
        val.push(this.valToStr(Math.abs(Math.floor((diff / 1000) % 60))));
      }
    } else {
      if (/hh/.test(this.format)) {
        val.push(this.valToStr(Math.abs(Math.ceil(diff / 1000 / 60 / 60))));
      }
      if (/mm/.test(this.format)) {
        val.push(this.valToStr(Math.abs(Math.ceil((diff / 1000 / 60) % 60))));
      }
      if (/ss/.test(this.format)) {
        val.push(this.valToStr(Math.abs(Math.ceil((diff / 1000) % 60))));
      }
    }

    if (this.vertical) {
      return val;
    }

    if (diff < 0 && this.needAttention) {
      this.isAttention = true;
    }
    return val.join(":");
  }

  constructor(
    public timeIntervalService: TimeIntervalService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (!this.direction) {
      throw new Error('Need to set "direction" attribute');
    }

    this.fn = this[`${this.direction}Date`];
  }

  ngOnChanges(changes: SimpleChanges) {
    if ("date" in changes && this.date) {
      if (this.interval) {
        if (this._intervalSubs) {
          this._intervalSubs.unsubscribe();
          this._intervalSubs = null;
        }

        this._intervalSubs = this.timeIntervalService
          .getInterval(this.interval, 0)
          .pipe(takeUntil(this._destroy$))
          .subscribe((value) => {
            this._cd.detectChanges();
            if (value === this.checkMinut * 60) {
              this.timeCheck.emit(true);
            }
            this.valueChanges.emit(value);
          });
      }
    }
  }

  ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public fromDate = (): number => {
    return new Date().getTime() - this.date.getTime();
  };

  public toDate = (): number => {
    return new Date(this.date).getTime() - new Date().getTime();
  };

  private valToStr(val: number): string {
    return val > 9 ? val.toString() : "0" + val;
  }
}
