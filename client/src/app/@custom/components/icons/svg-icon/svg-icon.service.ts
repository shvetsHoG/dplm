import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { switchMap, map, share } from "rxjs/operators";

@Injectable()
export class SvgIconService {
  private static _cache: Map<string, SVGElement> = new Map();
  private static _inProgressReqs: Map<string, Observable<SVGElement>> = new Map();

  private readonly SVG_TAG_SELECTOR = "svg";

  public loadSvg(icon: string): Observable<SVGElement> {
    if (SvgIconService._inProgressReqs.has(icon)) {
      return SvgIconService._inProgressReqs.get(icon);
    }

    let url: string;
    const path = new URL(`icons/${icon.toLowerCase()}.svg`, document.baseURI).href;
    try {
      url = path;
    } catch {
      return throwError(`svg icon ${path} isn't found`);
    }

    const observable = new Observable<SVGElement>((observer) => {
      const xhr = new XMLHttpRequest();

      xhr.overrideMimeType("image/svg+xml");
      xhr.open("GET", url, true);
      xhr.onload = () => {
        if (!xhr.responseXML) {
          observer.next(document.createElement("svg") as any);
          return;
        }

        const svg = xhr.responseXML.querySelector(this.SVG_TAG_SELECTOR);
        SvgIconService._cache.set(icon, svg);
        SvgIconService._inProgressReqs.delete(icon);
        observer.next(svg);
      };
      xhr.send(null);
    }).pipe(share());

    SvgIconService._inProgressReqs.set(icon, observable);
    return observable;
  }

  public getSvg(icon: string): Observable<SVGElement> {
    return of(SvgIconService._cache.get(icon)).pipe(
      switchMap((value) => {
        if (!value) {
          return this.loadSvg(icon);
        }
        return of(value);
      }),
      map((svg) => {
        return svg.cloneNode(true) as SVGElement;
      })
    );
  }
}
