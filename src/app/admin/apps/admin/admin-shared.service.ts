import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { PAGE_VALUES } from './constants';

@Injectable({
  providedIn: 'root',
})
export class AdminSharedService {
  public pageValue = PAGE_VALUES.company;

  private storageName = 'ADMIN_PAGE_VALUE';

  constructor(private storageService: StorageService) {
    const value = this.storageService.getItem(this.storageName);
    if (value) {
      this.pageValue = value;
    }
  }

  public onPageValueChange() {
    this.storageService.setItem(this.storageName, this.pageValue);
  }
}
