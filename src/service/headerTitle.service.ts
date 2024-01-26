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

  // create a function for adding words to the title string by adding a hyphen between them. The first word is not followed by a hyphen.
  addTitle(title: string) {
    if (this.title.getValue() === "") {
      this.title.next(title);
    } else {
      this.title.next(this.title.getValue() + " - " + title);
    }
  }

}
