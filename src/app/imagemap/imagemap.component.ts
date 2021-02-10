import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-imagemap',
  templateUrl: './imagemap.component.html',
  styleUrls: ['./imagemap.component.scss']
})
export class ImagemapComponent implements OnInit {

  @Input()
  src: string

  @Input()
  coordinates: ImageMapCoordinate[]

  @Input()
  canEdit: boolean

  @Output('onClick')
  onClick: EventEmitter<ImageMapCoordinate> = new EventEmitter();

  constructor() { }
  imageUrl;
  ngOnInit() { }

  getCoordinateStyle(coordinate: ImageMapCoordinate): object {
    return {
      top: `${coordinate.y}px`,
      left: `${coordinate.x}px`,
      height: `${coordinate.height}px`,
      width: `${coordinate.width}px`
    };
  }

  onAreaClick(coordinate) {
    var selectPos = document.getElementById('select-position');
    if(coordinate.name=="Marc")
    {
      this.imageUrl = "assets/1_S_rZk2NegUb-Hdgu6-9niQ.jpeg"
      selectPos.style.left = 0+ "px"
      selectPos.style.top = 0 + "px";
      selectPos.style.width = coordinate.width + "px";
      selectPos.style.height = coordinate.height + "px";
    }
    if(coordinate.name=="The sun"){
      this.imageUrl = "assets/images.png"
      selectPos.style.right = "64px";
      selectPos.style.left = "auto";
      selectPos.style.top = "121px" ;
      selectPos.style.width = coordinate.width + "px";
      selectPos.style.height = coordinate.height + "px";
    }
    this.onClick.emit(coordinate);
  }

  onAreaContext(e: MouseEvent, coordinate: ImageMapCoordinate) {
    if (this.canEdit) {
      if (coordinate) {
        console.log('editing')

      }
      else {
        console.log('creating')
      }

      e.stopPropagation();
      return false;
    }
  }

  onAreaCreate(x: number, y: number): ImageMapCoordinate {
    const coordinate = new ImageMapCoordinate({ x, y, width: 100, height: 100 });
    return coordinate
  }

  onAreaEdit(coordinate: ImageMapCoordinate): ImageMapCoordinate {
    return coordinate;
  }
}
export class ImageMapCoordinate {
  x: number = 0
  y: number = 0
  width: number = 100
  height: number = 100
  name?: string

  constructor(init?: Partial<ImageMapCoordinate>) {
    Object.assign(this, init);
  }

}
