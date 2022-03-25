import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private storageSub = new Subject<boolean>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  getItem(key: string) {
    const object = localStorage.getItem(key);

    return JSON.parse(object);
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
    this.storageSub.next(true);
  }

  setString(key: string, data: string) {
    localStorage.setItem(key, data);
    this.storageSub.next(true);
  }

  removeItem(key) {
    localStorage.removeItem(key);
    this.storageSub.next(true);
  }
}
