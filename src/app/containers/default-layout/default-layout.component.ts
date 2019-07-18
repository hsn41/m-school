import { Component, OnDestroy, Inject, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { navItems } from "../../_nav";
import { UserService } from "../../views/admin/user.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html"
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  userIsAuthenticated = false;
  private authListnerSubs: Subscription;
  constructor(
    @Inject(DOCUMENT) _document?: any,
    private userService: UserService
  ) {
    this.changes = new MutationObserver(mutations => {
      this.sidebarMinimized = _document.body.classList.contains(
        "sidebar-minimized"
      );
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }
  ngOnInit() {
    this.authListnerSubs = this.userService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
