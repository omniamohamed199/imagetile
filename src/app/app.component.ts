import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { ImageMapCoordinate } from './imagemap/imagemap.component';
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
    //  this.handleFileSelect()
  }
  // handleFileSelect() {
  //   var dstCanvas = document.getElementById('dst-canvas');
  //   var previewArea = document.getElementById('preview-area');
  //   var newImage = document.createElement('img');
  //   newImage.src="assets/images.png"
  //     this.shredder = null;
  //     newImage.onload =()=> {
  //       this.shredder = new CanvasShredder(newImage, previewArea, { storeOriginalInCanvas: false });
  //       var slicePosition = { x: 0, y: 0, size: 84 };
  //       var selectPos = document.getElementById('select-position');
  //       slicePosition.x = previewArea.offsetWidth / 2;
  //       slicePosition.y = previewArea.offsetHeight / 2;
  //       selectPos.style.left = slicePosition.x + "px";
  //       selectPos.style.top = slicePosition.y + "px";
  //       selectPos.style.width = slicePosition.size + "px";
  //       selectPos.style.height = slicePosition.size + "px";
  //       var mc = new Hammer(previewArea.children[2]);
  //       mc.on("tap",  (event) => {
  //           this.posX = (event.srcEvent.pageX - previewArea.offsetLeft) - slicePosition.size / 2;
  //           this.posY = (event.srcEvent.pageY - previewArea.offsetTop) - slicePosition.size / 2;
  //           selectPos.style.left = this.posX + "px";
  //           selectPos.style.top = this.posY + "px";
  //           selectPos.style.width = slicePosition.size + "px";
  //           selectPos.style.height = slicePosition.size + "px";
  //           this.imageUrl =  this.shredder.slice(this.posX, this.posY, slicePosition.size, dstCanvas);
  //           this.open = true

  //       })
  //     };
  // }
  save(event) {
    console.log(event)
  }
  image: string = 'https://image.shutterstock.com/image-vector/solar-system-sun-planets-vector-260nw-751091653.jpg'
  coordinates: ImageMapCoordinate[] = [
    {
      name: 'The sun',
      x: 0,
      y: 159,
      width: 95,
      height: 100
    },
    {
      name: 'Marc',
      x: 110,
      y: 40,
      width: 50,
      height: 50
    }
    ,
    {
      name: 'Jupiter',
      x: 197,
      y: 59,
      width: 64,
      height: 62
    }
  ]

  showImage: boolean

  // getClick(coordinate: ImageMapCoordinate) {
  //   console.log(`Clicked on ${coordinate.name}`)
  //   // this.open=true
  //   // this.imageUrl='assets/images.png'
  // }
  constructor(private renderer: Renderer2) { }
  @ViewChild('canvas', { static: true }) public canvas: ElementRef;

  @Input() public width = 300;
  @Input() public height = 300;
  carPart;
  private cx: CanvasRenderingContext2D;
  Whichpart(title) {
    this.carPart = title
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    let newImg = this.renderer.createElement('img');
    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.captureEvents(canvasEl);
    switch (title) {
      case 'FrontDoor':
        newImg.src = "assets/sep-2.png";
        newImg.onload = this.drawImg(newImg);
        break;
      case 'BackDoor':
        newImg.src = "assets/sep-1.png";
        newImg.onload = this.drawImg(newImg);
        break;
      default:
        break;
    }

  }
  drawImg(imgContext) {
    console.log('drawImg called');
    setTimeout(() => {
      this.cx.drawImage(imgContext, 10, 10, this.width, this.height);
      this.open = true
    }, 500);

  }
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'touchmove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'touchend')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'touchend')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].targetTouches[0].clientX - rect.left,
          y: res[0].targetTouches[0].clientY - rect.top
        };
        const currentPos = {
          x: res[1].targetTouches[0].clientX - rect.left,
          y: res[1].targetTouches[0].clientY - rect.top
        };
        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
      const touchend = fromEvent(canvasEl, 'touchend')
      touchend.subscribe(res=>{
        this.restore_array.push(this.cx.getImageData(0,0,this.width,this.height))
        this.index+=1
      })
  }
  restore_array = []
  index = -1;
  bErasing = false
  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }
    this.cx.beginPath();
    if(this.bErasing == true){
      this.cx.globalCompositeOperation="destination-out";
      this.cx.lineWidth = 8;
    }else{
      this.cx.globalCompositeOperation="source-over";
    }
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
      this.cx.strokeStyle = "#FF0000";
  }
  saveIm() {
    var image = new Image();
    image.src = this.canvas.nativeElement.toDataURL();
    console.log(image.src)
  }
  undo() {
    if(this.index<=0)
    {
      this.Whichpart(this.carPart)
    }
    else{
      this.index-=1
      this.restore_array.pop()
      this.cx.putImageData(this.restore_array[this.index],0,0)
    }
  }
}

