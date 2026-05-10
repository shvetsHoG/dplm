import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateFormatPipe } from "./pipes/data-format.pipe";
import { OverlayService } from "./services/overlay.service";
import { OverlayComponent } from "./components/overlay/overlay.component";
import { PluralPipe } from "./pipes/plural.pipe";
import { ErrorHandlerService } from "./services/error-handler.service";
import { ErrorDialogComponent } from "./components/error-dialog/error-dialog.component";
import { OverControlDirective } from "./directives/over-control.directive";
import { FnPipe } from "./pipes/fn.pipe";
import { LoaderDirective } from "./directives/loader.directive";
import { TimeIntervalService } from "./services/time-interval.service";
import { ToastService } from "./services/toast.service";
import { IconsModule } from "@custom/components/icons/icons.module";
import { TooltipModule } from "@custom/components/tooltip/tooltip.module";
import { ThemeDirective } from "@custom/common/directives/theme.directive";

const declarations = [
  DateFormatPipe,
  PluralPipe,
  OverlayComponent,
  ErrorDialogComponent,
  OverControlDirective,
  LoaderDirective,
  FnPipe,
  ThemeDirective
];

@NgModule({
  exports: declarations,
  declarations,
  imports: [CommonModule, IconsModule, TooltipModule],
  providers: [DateFormatPipe, PluralPipe, ErrorHandlerService, OverlayService, TimeIntervalService, ToastService]
})
export class CustomCommonModule {}
