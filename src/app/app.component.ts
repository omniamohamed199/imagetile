import { Component, OnInit } from '@angular/core';
declare const CanvasShredder: any;
declare const Hammer: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'imagetile';
  shredder = null;
  imageUrl;
  open = false
  needsUpdate = false;
  startPosition = {};
  posX; posY;
  ngOnInit(): void {
     this.handleFileSelect()
  }
  handleFileSelect() {
    var dstCanvas = document.getElementById('dst-canvas');
    var previewArea = document.getElementById('preview-area');
    var newImage = document.createElement('img');
    newImage.src="assets/images.png"
      this.shredder = null;
      newImage.onload =()=> {
        this.shredder = new CanvasShredder(newImage, previewArea, { storeOriginalInCanvas: false });
        var slicePosition = { x: 0, y: 0, size: 120 };
        var selectPos = document.getElementById('select-position');
        slicePosition.x = previewArea.offsetWidth / 2;
        slicePosition.y = previewArea.offsetHeight / 2;
        selectPos.style.left = slicePosition.x + "px";
        selectPos.style.top = slicePosition.y + "px";
        selectPos.style.width = slicePosition.size + "px";
        selectPos.style.height = slicePosition.size + "px";
        var mc = new Hammer(previewArea.children[2]);
        mc.on("tap",  (event) => {
            this.posX = (event.srcEvent.pageX - previewArea.offsetLeft) - slicePosition.size / 2;
            this.posY = (event.srcEvent.pageY - previewArea.offsetTop) - slicePosition.size / 2;
            selectPos.style.left = this.posX + "px";
            selectPos.style.top = this.posY + "px";
            selectPos.style.width = slicePosition.size + "px";
            selectPos.style.height = slicePosition.size + "px";
            this.imageUrl =  this.shredder.slice(this.posX, this.posY, slicePosition.size, dstCanvas);
            this.open = true
          
        })
      };
  }
  save(event)
  {
    console.log(event)
  }
 
}

