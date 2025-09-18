import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-barcode-generator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './barcode-generator.html',
  styleUrl: './barcode-generator.css'
})
export class BarcodeGenerator implements AfterViewInit {
  @ViewChild('barcodeCanvas', { static: true }) barcodeCanvas!: ElementRef<HTMLCanvasElement>;
  
  barcodeData: string = '';
  barcodeFormat: string = 'CODE128';

  ngAfterViewInit() {
    this.generateBarcode();
  }

  onInputChange() {
    this.generateBarcode();
  }

  clearBarcode() {
    this.barcodeData = '';
    this.clearCanvas();
  }

  generateBarcode() {
    if (this.barcodeData) {
      try {
        JsBarcode(this.barcodeCanvas.nativeElement, this.barcodeData, {
          format: this.barcodeFormat,
          width: 2,
          height: 100,
          displayValue: true
        });
      } catch (error) {
        console.error('Invalid barcode data for selected format');
      }
    } else {
      this.clearCanvas();
    }
  }

  // Canvas clearing method
  private clearCanvas() {
    const canvas = this.barcodeCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Clear the entire canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Reset canvas size to ensure it's properly cleared
      canvas.width = canvas.width;
    }
  }
}