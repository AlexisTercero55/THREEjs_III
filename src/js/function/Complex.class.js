export class Complex {
    constructor(real, imag) {
      this.real = real;
      this.imag = imag;
    }
  
    add(other) {
      return new Complex(this.real + other.real, this.imag + other.imag);
    }
  
    multiply(other) {
      return new Complex(
        this.real * other.real - this.imag * other.imag,
        this.real * other.imag + this.imag * other.real
      );
    }
  
    abs() {
      return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
}
  