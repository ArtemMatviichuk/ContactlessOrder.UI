import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { SharedService } from "../services/shared.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @Output() linkClicked = new EventEmitter();

  public showMenu = "";
  public showSubMenu = "";
  public isReplace = false;
  public sidebarNavItems = [];


  constructor(
    public sharedService: SharedService,
    public router: Router,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.cdr.markForCheck();
  }

  public onSidebarItemClick(item) {
    if (item.submenu.length === 0) {
      this.linkClicked.emit();
      return;
    }

    this.addExpandClass(item.title);
  }

  /**
   * Add expand class
   * @param element
   */
  public addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = "";
    } else {
      this.showMenu = element;
    }
  }

  public trackByFn = (index, item) => item.id;
}
