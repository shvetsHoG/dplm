import { Renderer2 } from "@angular/core";

export class ObjectMap {
  constructor(
    public value: string,
    public key: string
  ) {}
}

export class ObjectEnum {
  constructor(
    public value: any,
    public key: string
  ) {}
}

export function getSecond(days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0): number {
  return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
}

export function parseDate(date: string) {
  return date ? new Date(date) : null;
}

const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
const clearStyle = /(\" style=\"text-decoration: none;\">)/gim;
const clearHref = /(<a href=\")/gim;
const clearA = /(<\/a>)/gim;
export const linkify = (inputText: string) => {
  let replacedText: string;
  replacedText = inputText.replace(clearStyle, " ");
  replacedText = replacedText.replace(clearHref, "");
  replacedText = replacedText.replace(clearA, "");

  // URLs starting with http://, https://, or ftp://
  replacedText = replacedText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  // Change email addresses to mailto:: links.
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
};

const replaceLinkifyHref =
  /\[([\.[\S]+[-A-ZА-я0-9+&@#\/%?=~_|!:,.;\s]+)\]\(((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\)/gim;
// const replaceLinkifyHrefInput = /((?![="]).\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

const replaceLinkifyHrefInput = /(\B([^"])(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

export const linkifyInput = (inputText: string, isInput?: boolean, isEditLink?: boolean) => {
  let replacedText: string;

  if (isInput) {
    replacedText = inputText.replace(replaceLinkifyHrefInput, '<a href="$1" target="_blank">$1</a>');
    return replacedText;
  }

  // if (isEditLink) {
  //   return inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
  // }

  replacedText = inputText.replace(replaceLinkifyHref, '<a href="$2" target="_blank">$1</a>');
  return replacedText;
};

export class ObjectHelper {
  public static createQueryParams = (obj: { [key: string]: any }): string => {
    return Object.entries(obj)
      .reduce((arr, item) => {
        if (item[1] || item[1] === 0 || item[1] === false) {
          arr.push(item.join("="));
        }
        return arr;
      }, [])
      .join("&");
  };

  public static getKeyEnumByValue = <T, K extends keyof T>(enumObject: T, enumValue: T[K] | string): K => {
    return Object.keys(enumObject).find((key) => enumObject[key] === enumValue) as K;
  };

  public static formatTime(time: number): string {
    if (!time) {
      return "0:00";
    }
    return [Math.floor((time % 3600) / 60), ("00" + Math.round(time % 60)).slice(-2)].join(":");
  }
}
