import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { FullRoutingModule } from "./full-routing.module";
import { FullComponent } from "./full.component";

@NgModule({
  declarations: [FullComponent],
  imports: [
    CommonModule,
    FullRoutingModule,
    SharedModule,
  ],
})
export class FullModule {}
