import { Component } from '@angular/core';
import { APPCONFIG } from './config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public AppConfig: any;
  title = 'Grizzly-Auth';
  ngOnInit() {
    this.AppConfig = APPCONFIG;
  }
}
