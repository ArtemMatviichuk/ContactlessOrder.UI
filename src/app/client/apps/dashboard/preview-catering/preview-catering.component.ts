import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-preview-catering',
  templateUrl: './preview-catering.component.html',
  styleUrls: ['./preview-catering.component.scss'],
})
export class PreviewCateringComponent implements OnChanges {
  @Input() catering: any;

  public menu = [];

  constructor(
    private clientService: ClientService,
    private sharedService: SharedService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.getMenu();
  }

  public getTime() {
    const openTime = this.catering.openTime;
    const closeTime = this.catering.closeTime;
    return `${openTime.hour.toString().padStart(2, '0')}:${openTime.minute
      .toString()
      .padStart(2, '0')}-${closeTime.hour
      .toString()
      .padStart(2, '0')}:${closeTime.minute.toString().padStart(2, '0')}`;
  }

  private async getMenu() {
    try {
      this.menu = await this.clientService.getMenu(this.catering.id);
      console.log(this.menu)
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}
