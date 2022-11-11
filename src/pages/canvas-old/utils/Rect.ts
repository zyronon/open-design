import {Shape} from "./Shape";

export class Rect extends Shape {
  constructor(props: any) {
    super(props);
  }

  draw(ctx: CanvasRenderingContext2D): void {

  }

  isIn(): boolean {
    return true
  }

}