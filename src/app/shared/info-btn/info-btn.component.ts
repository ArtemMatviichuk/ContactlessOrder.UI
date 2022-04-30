import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info-btn.component.html',
  styleUrls: ['./info-btn.component.scss'],
})
export class InfoButtonComponent implements OnInit {
  @Input() text = '';

  public showText = false;

  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {}

  public onMouseOver() {
    setTimeout(() => {
      this.showText = true;
      this.cdr.markForCheck();
    }, 350);
  }

  public onMouseLeave() {
    setTimeout(() => {
      this.showText = false;
      this.cdr.markForCheck();
    }, 350);
  }
}
