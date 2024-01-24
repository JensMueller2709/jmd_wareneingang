import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class HeaderTitleService {
  title = new BehaviorSubject('');

  setTitle(title: string) {
    this.title.next(title);
  }

  getTitle() : string {
    return this.title.getValue();
  }

  addTitle(title: string){
    this.title.next(this.getTitle() + " - " + title);
  }

}
