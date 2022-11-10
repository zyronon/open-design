export abstract class A {
  a() {
  }

  b() {
  }

  c() {
  }
}


abstract class P {
  test = false

  abstract a(): void

  b(): void {
  }

  c(): void {
  }
}

export class C extends P {
  constructor() {
    super();
    this.test = false
    this.a()
  }


  d() {

  }

  a(): void {
  }
}