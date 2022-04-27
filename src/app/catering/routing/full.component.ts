import { ChangeDetectionStrategy, Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SharedService } from "src/app/shared/services/shared.service";
import { CateringNotificationService } from "../apps/catering/catering-notification.service";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullComponent implements OnInit {
  constructor(
    public sharedService: SharedService,
    public router: Router,
    private notificationService: CateringNotificationService
  ) {}

  async ngOnInit() {
    if (window.location.pathname === "/") {
      this.router.navigate(["/dashboard"]);
    }

    await this.notificationService.connect();
  }

}
