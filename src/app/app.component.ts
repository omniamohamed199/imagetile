import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { switchMap, takeUntil, pairwise, exhaustMap } from 'rxjs/operators'
import { ImageMapCoordinate } from './imagemap/imagemap.component';
declare const CanvasShredder: any;
declare const Hammer: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 
  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {
    
  }
  @ViewChild('canvas', { static: true }) public canvas: ElementRef;
  @ViewChild('palette', { static: true }) public palette;
   width = 320;
   height = 500;
  carPart;
  private cx: CanvasRenderingContext2D;
  restore_array:any[] = []
  index = -1;
  bErasing = false
  drawingSubscription: Subscription;
  open = false
  Whichpart(title) {
    this.carPart = title
    this.bErasing=false
    this.palette.value="#000000"
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
        newImg.src = "../assets/sep-2.png";
        newImg.onload = this.drawImg(newImg.src);
        break;
      case 'BackDoor':
        newImg.src = "../assets/sep-1.png";
        newImg.onload = this.drawImg(newImg.src);
        break;
        case 'BackPeice':
        newImg.src = "../assets/sep-3.png";
        newImg.onload = this.drawImg(newImg.src);
        break;
      case 'FrontPiece':
        newImg.src = "../assets/sep-4.png";
        newImg.onload = this.drawImg(newImg.src);
        break;
      default:
        break;
    }

  }
  drawImg(imgContext) {
    console.log('drawImg called');
    setTimeout(() => {
      this.canvas.nativeElement.style.background= `url('${imgContext}')`;
      this.canvas.nativeElement.style.backgroundPosition="center center"
      this.canvas.nativeElement.style.backgroundSize="103% 103%";
      this.open = true
      this.index=-1
    }, 500);

  }
  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'touchmove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'touchend')),
              pairwise()
            )
        })
      )
      .subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].targetTouches[0].clientX - rect.left,
          y: res[0].targetTouches[0].clientY - rect.top
        };
        const currentPos = {
          x: res[1].targetTouches[0].clientX - rect.left,
          y: res[1].targetTouches[0].clientY - rect.top
        };
        this.drawOnCanvas(prevPos, currentPos);
      });
      this.drawingSubscription = fromEvent(canvasEl, 'touchend').subscribe(res=>{
      console.log(res);
       this.cx.stroke()
       this.cx.closePath()
        this.restore_array.push(this.cx.getImageData(0,0,this.width,this.height))
        this.index+=1
      })
  }
 

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }
    this.cx.beginPath();
    if(this.bErasing == true){
      this.cx.globalCompositeOperation="destination-out";
      this.cx.lineWidth = 8;
    }else{
      this.cx.globalCompositeOperation="source-over";
      this.cx.lineWidth = 3;
    }
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
      this.cx.strokeStyle = this.palette.value;
  }
  saveIm() {
    var image = new Image();
    image.src = this.canvas.nativeElement.toDataURL();
    console.log(image.src)
  }
  undo() {
    if(this.index<=0)
    {
      // this.Whichpart(this.carPart)
      this.restore_array=[]
      this.index=-1
      this.clear()
      
    }
    else{
      this.index-=1
      this.restore_array.pop()
      this.cx.putImageData(this.restore_array[this.index],0,0)
    }
  }
  clear()
  {
    this.cx.clearRect(0,0,this.width,this.height)
    // this.cx.fillRect(0,0,this.width,this.height)
  }
  close()
  {
    this.open=false
    this.drawingSubscription.unsubscribe()
  }
}

