import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimeIntervalComponent } from "./time-interval.component";

@NgModule({
  exports: [TimeIntervalComponent],
  declarations: [TimeIntervalComponent],
  imports: [CommonModule]
})
export class TimeIntervalModule {}
