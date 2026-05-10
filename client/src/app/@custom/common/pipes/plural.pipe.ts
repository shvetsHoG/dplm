import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "plural",
    standalone: false
})
export class PluralPipe implements PipeTransform {
  transform(num: number, titles: string[], onlyString = false): string {
    const cases = [2, 0, 1, 1, 1, 2];
    const title = titles[num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]];
    const index = title.indexOf("%n");
    if (index > -1) {
      return `${title.substr(0, index)}${num}${title.substr(index + 2)}`;
    }
    if (onlyString) {
      return `${title}`;
    }
    return `${num} ${title}`;
  }
}
