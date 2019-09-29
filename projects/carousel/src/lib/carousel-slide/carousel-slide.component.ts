import { ListKeyManagerOption } from '@angular/cdk/a11y';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  OnChanges, SimpleChanges
} from '@angular/core';
import { DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';

import { MatCarouselSlide } from './carousel-slide';

@Component({
  selector: 'mat-carousel-slide',
  templateUrl: './carousel-slide.component.html',
  styleUrls: ['./carousel-slide.component.scss']
})
export class MatCarouselSlideComponent
  implements ListKeyManagerOption, MatCarouselSlide, OnInit, OnChanges {

  @Input() public image: SafeUrl;
  @Input() public spriteOffsetX: number = 0;
  @Input() public spriteOffsetY: number = 0;
  @Input() public spriteWidth: number = 0;
  @Input() public spriteHeight: number = 0;
  @Input() public spriteCenter: boolean = false;
  @Input() public overlayColor = '#00000040';
  @Input() public hideOverlay = false;
  @Input() public disabled = false; // implements ListKeyManagerOption

  public spriteTransform: SafeStyle;

  @ViewChild(TemplateRef, {static: false}) public templateRef: TemplateRef<any>;
  @ViewChild('carouselSlideHolder', {static: false}) slideHolder: ElementRef;
  @ViewChild('carouselSlideImage', {static: false}) slideImage: ElementRef;

  constructor(public sanitizer: DomSanitizer) {
  }

  onResize(event) {
    this.adjustSprite();
  }

  onImageLoad() {
     this.adjustSprite();
  }

  public adjustSprite(): void {
    if(!this.image) {
      return;
    }

    if(this.slideHolder === undefined || this.slideImage === undefined) {
      return;
    }

    if(this.spriteWidth > 0 && this.spriteHeight > 0) {
      var delta: number = Math.max(this.slideHolder.nativeElement.clientWidth / this.spriteWidth,
          this.slideHolder.nativeElement.clientHeight / this.spriteHeight);

      var centerWidth: number = 0;
      var centerHeight: number = 0;

      // Center sprite in non dominate axis
      if(this.spriteCenter && this.slideHolder.nativeElement.clientWidth < (this.spriteWidth*delta)) {
        centerWidth = (this.spriteWidth - this.slideHolder.nativeElement.clientWidth/delta) / 2.0
      } else if(this.spriteCenter && this.slideHolder.nativeElement.clientHeight < (this.spriteHeight*delta)) {
        centerHeight = (this.spriteHeight - this.slideHolder.nativeElement.clientHeight/delta) / 2.0
      }

      // Invert offset
      var offsetX: number = -1 * (this.spriteOffsetX + centerWidth);
      var offsetY: number = -1 * (this.spriteOffsetY + centerHeight);

      // Translate before scale to translate in units of sprite, instead of scalled units.
      this.spriteTransform = this.sanitizer.bypassSecurityTrustStyle("scale(" + delta + ") translate(" + offsetX + "px," + offsetY + "px) ");
    } else {
      // Emulate background-size: cover
      var delta: number = Math.max(this.slideHolder.nativeElement.clientWidth / this.slideImage.nativeElement.naturalWidth,
          this.slideHolder.nativeElement.clientHeight / this.slideImage.nativeElement.naturalHeight);

      this.spriteTransform = this.sanitizer.bypassSecurityTrustStyle("scale(" + delta + ")");
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.adjustSprite();
  }

  public ngOnInit(): void {
    if(this.image) {
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.image}`);
    }
  }
}
