import {Component, OnInit} from '@angular/core';

declare let $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    this.initUI();
  }

  initUI() {

  }

  toggleTopBar() {
    $('.sidebar').sidebar({
      "transition": "scale out",
      "silent":"true"
    }).sidebar('toggle');
  }

}
