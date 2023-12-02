import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[NoImagen]',
})
export class NoImagenDirective {
  imageSrc: string = '/assets/no-image.gif';

  constructor(private elementRef: ElementRef<HTMLImageElement>) {
    this.setCursorPointer();
  }

  private setCursorPointer(): void {
    this.elementRef.nativeElement.style.cursor = 'pointer';
  }

  @HostListener('error')
  onError(): void {
    if (this.elementRef.nativeElement.src !== this.imageSrc) {
      this.elementRef.nativeElement.src = this.imageSrc;
    }
  }
}
