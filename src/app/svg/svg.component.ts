import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.svg',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {
  fillColor = 'rgb(255, 0, 0)';
  changeColor() {
    console.log('SSSS')
  }

  constructor() { }

  ngOnInit(): void {
  }

}
