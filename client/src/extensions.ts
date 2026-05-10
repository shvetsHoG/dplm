Date.prototype.toFullString = function () {
  return this
    ? this.toLocaleDateString("ru-Ru", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      })
    : "";
};

Date.prototype.timeLeft = function (dateTwo) {
  const dt1 = new Date(this);
  const dt2 = new Date(dateTwo);
  let str = "";

  const msDiff = dt1.getTime() > dt2.getTime() ? dt1.getTime() - dt2.getTime() : dt2.getTime() - dt1.getTime();
  const dirtHours = msDiff / 1000 / 60 / 60;
  const hours = Math.floor(dirtHours);
  const minutes = Math.floor((dirtHours - hours) * 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    str += `${days} д. `;
  }

  if (hours > 0) {
    str += `${hours % 24} ч. `;
  }

  if (minutes > 0) {
    str += `${minutes} мин`;
  }

  return str;
};

Date.prototype.hasTime = function () {
  return this.getHours() > 0 || this.getMinutes() > 0 || this.getSeconds() > 0 || this.getMilliseconds() > 0;
};

Date.prototype.daysLeft = function (dateTwo = new Date()) {
  const dt1 = new Date(this);
  const dt2 = new Date(dateTwo);

  const msDiff = dt1.getTime() - dt2.getTime();
  const dirtDays = msDiff / 1000 / 60 / 60 / 24;
  const days = Math.floor(dirtDays);

  return days;
};

Date.prototype.getWeekdayNum = function () {
  let day = this.getDay();
  if (day === 6) {
    day = 0;
  }
  if (day === 0) {
    day = 6;
  }
  return day;
};

Date.prototype.getWeekday = function () {
  const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
  return days[this.getWeekdayNum()];
};

Date.prototype.diffDays = function (d: Date | number = Date.now()) {
  let date: any;

  if (typeof d !== "number") {
    date = d.getTime();
  } else {
    date = d;
  }

  return Math.floor((date - this.getTime()) / (1000 * 60 * 60 * 24));
};

Date.prototype.toMonthFormatString = function (
  filter?: (result: string) => string,
  month?: "numeric" | "2-digit" | "narrow" | "short" | "long"
) {
  const result = this
    ? this.toLocaleDateString("ru-Ru", {
        year: "numeric",
        month,
        day: "numeric"
      })
    : "";
  return filter ? filter(result) : result;
};

Date.prototype.getDMY = function (): string {
  let d = this;
  if (typeof this === "string") {
    d = new Date(d);
  }
  const month = (d.getMonth() + 1).toString().length < 2 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  const day = d.getDate().toString().length < 2 ? "0" + d.getDate() : d.getDate();
  return d.getFullYear() + "-" + month + "-" + day;
};

Date.prototype.getDMYnormal = function (): string {
  let d = this;
  if (typeof this === "string") {
    d = new Date(d);
  }
  const month = (d.getMonth() + 1).toString().length < 2 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  const day = d.getDate().toString().length < 2 ? "0" + d.getDate() : d.getDate();
  return day + "-" + month + "-" + d.getFullYear();
};

Date.prototype.setDMY = function (d: Date): Date {
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  this.setFullYear(year);
  this.setMonth(month, day);
  return this;
};

Date.prototype.addHours = function (h: number) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

Date.prototype.addDays = function (d: number): Date {
  return new Date(this.getTime() + d * 24 * 60 * 60 * 1000);
};

Date.prototype.withoutTimezone = function () {
  const date = new Date(this);
  date.setTime(this.getTime() + this.getTimezoneOffset() * 1000 * 60);
  return date;
};

Date.prototype.withTimezone = function () {
  const date = new Date(this);
  date.setTime(this.getTime() - this.getTimezoneOffset() * 1000 * 60);
  return date;
};

Date.prototype.withoutTime = function () {
  const d = new Date(this);
  d.setHours(0, 0, 0, 0);
  return d;
};

Date.prototype.withoutDate = function () {
  const d = new Date(this);
  const date = new Date(0);
  date.setHours(d.getHours(), d.getMinutes(), d.getSeconds());
  return date;
};

Date.prototype.putTime = function (time: Date) {
  const d = new Date(this);
  d.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
  return d;
};

String.prototype.toKebabCase = function () {
  return this.replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

String.prototype.toCapitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.move = function (from: number, to: number) {
  this.splice(to, 0, this.splice(from, 1)[0]);
  return this;
};

Array.prototype.groupBy = function (propertyName) {
  return this.reduce((groups, item) => {
    const val = item[propertyName];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};

Array.prototype.sortBy = function <T>(propertyName, direction: "asc" | "desc" = "asc") {
  return (this as Array<T>).sort((a, b) => {
    if (a[propertyName] > b[propertyName]) {
      return direction === "asc" ? 1 : -1;
    }
    if (a[propertyName] < b[propertyName]) {
      return direction === "asc" ? -1 : 1;
    }
    return 0;
  });
};

Array.prototype.equals = function <T>(array: Array<T>) {
  if (!array) {
    return false;
  }

  if (this.length !== array.length) {
    return false;
  }

  for (let i = 0, l = this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i])) {
        return false;
      }
    } else if (this[i] !== array[i]) {
      return false;
    }
  }
  return true;
};

String.prototype.replaceAt = function (index: number, replacement: string): string {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};
