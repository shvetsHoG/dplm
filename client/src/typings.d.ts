import { tap } from "rxjs/operators";

declare global {
  interface Date {
    toFullString(): string;
    daysLeft(value?): number;
    getWeekday(): string;
    diffDays(d?: Date | number): number;
    timeLeft(value): string;
    addHours(h: number): Date;
    putTime(t: Date): Date;
    addDays(d: number): Date;
    putTime(t: Date): Date;
    withoutTimezone(): Date;
    withTimezone(): Date;
    withoutTime(): Date;
    withoutDate(): Date;
    getWeekdayNum(): number;
    hasTime(): boolean;
    setDMY(d: Date): Date;
    getDMY();
    getDMYnormal();
    toMonthFormatString(
      filter?: (result: string) => string,
      month?: "numeric" | "2-digit" | "narrow" | "short" | "long"
    );
  }

  interface String {
    toKebabCase(): string;
    toCapitalize(): string;
    replaceAt(index: number, replacement: string): string;
  }

  interface Array<T> {
    move(from, to): Array<T>;
    groupBy(prop: string): { [key: string]: Array<T> };
    sortBy(propertyName: string, direction?: "asc" | "desc"): Array<T>;
    equals(array: Array<T>): boolean;
  }

  interface Window {
    define: any;
    require: any;
  }

  interface NodeJS {
    [key: string]: any;
  }
}
