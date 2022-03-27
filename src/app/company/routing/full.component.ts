import { ChangeDetectionStrategy, Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SharedService } from "src/app/shared/services/shared.service";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullComponent implements OnInit {
  tabStatus = "justified";

  public isCollapsed = false;
  public enableChat;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;
  public loader = true;
  public accessTab = false;
  public isOpen = false;
  public showNavigation = true;

  public options = {
    theme: "light", // two possible values: light, dark
    dir: "ltr" as const, // two possible values: ltr, rtl
    layout: "vertical", // fixed value. shouldn't be changed.
    sidebarType: "mini-sidebar", // four possible values: full, iconbar, overlay, mini-sidebar
    sidebarPos: "fixed", // two possible values: fixed, absolute
    headerPos: "fixed", // two possible values: fixed, absolute
    boxed: "full", // two possible values: full, boxed
    navbarBg: "skin6", // six possible values: skin(1/2/3/4/5/6)
    sidebarBg: "skin3", // six possible values: skin(1/2/3/4/5/6)
    logoBg: "skin3", // six possible values: skin(1/2/3/4/5/6)
  };

  constructor(
    public sharedService: SharedService,
    public router: Router
  ) {}

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.handleSidebar();
  }

  ngOnInit() {
    this.showNavigation =
      this.router.url.indexOf("/first-piece-inspection/drawing") === -1;

    if (window.location.pathname === "/") {
      this.router.navigate(["/dashboard"]);
    }

    this.defaultSidebar = this.options.sidebarType;
    this.handleSidebar();
  }

  logo() {
    this.expandLogo = !this.expandLogo;
  }

  closeSidebar(isOpen) {
    if (isOpen) {
      this.isOpen = true;
      this.showMobileMenu = !this.showMobileMenu;
      return;
    }
    if (!this.isOpen) {
      this.showMobileMenu = false;
    } else {
      this.isOpen = false;
    }
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case "full":
      case "iconbar":
        break;

      case "overlay":
        break;

      default:
    }
  }

  /**
   * Toggle sidebar type
   */
  public toggleSidebarType() {
    switch (this.options.sidebarType) {
      case "full":
      case "iconbar":
        this.options.sidebarType = "mini-sidebar";
        break;

      case "overlay":
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case "mini-sidebar":
        if (this.defaultSidebar === "mini-sidebar") {
          this.options.sidebarType = "full";
        } else {
          this.options.sidebarType = this.defaultSidebar;
        }
        break;

      default:
    }
  }
}
