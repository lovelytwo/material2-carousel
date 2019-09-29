import { SafeUrl } from '@angular/platform-browser';

export interface MatCarouselSlide {
  image: SafeUrl;
  overlayColor: string;
  hideOverlay: boolean;
  disabled: boolean;
  spriteOffsetX: number;
  spriteOffsetY: number;
  spriteWidth: number;
  spriteHeight: number;
  spriteCenter: boolean;
}
