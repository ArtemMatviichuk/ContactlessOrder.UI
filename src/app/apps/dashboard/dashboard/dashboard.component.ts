import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { version } from "package.json";
import { AuthService } from "src/app/shared/services/auth.service";
import { SharedService } from "src/app/shared/services/shared.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  public allowed: any[];
  public notAllowed: any[];

  constructor(
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.sharedService.appsPreload = true;

    this.allowed = [];
    this.notAllowed = [];

    this.sharedService.appsPreload = false;

    this.cdr.markForCheck();
  }
}
