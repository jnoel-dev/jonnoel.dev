import * as fabric from "fabric";

export class Sprite extends fabric.Image {
  get type(): string {
    return "sprite";
  }

  // Declare the static property with the appropriate type
  static async: boolean = true;

  spriteWidth: number = 64;
  spriteHeight: number = 64;
  spriteIndex: number = 0;
  frameTime: number = 400;

  tmpCanvasEl!: HTMLCanvasElement;
  spriteImages: HTMLImageElement[] = [];

  animInterval?: number;
  onPlay?: () => void;

  constructor(
    element: HTMLImageElement,
    options: Partial<fabric.ImageProps> = {}
  ) {
    options.width = options.width || 64;
    options.height = options.height || 64;
    super(element, options);

    this.createTmpCanvas();
    this.createSpriteImages();
  }

  createTmpCanvas(): void {
    this.tmpCanvasEl = fabric.util.createCanvasElement() as HTMLCanvasElement;
    this.tmpCanvasEl.width = this.spriteWidth || this.width;
    this.tmpCanvasEl.height = this.spriteHeight || this.height;
  }

  createSpriteImages(): void {
    this.spriteImages = [];
    const imgElement = this.getElement();
    if (!imgElement) {
      throw new Error("Image element not found.");
    }
    const steps = imgElement.width / this.spriteWidth;
    for (let i = 0; i < steps; i++) {
      this.createSpriteImage(i);
    }
  }

  createSpriteImage(i: number): void {
    const tmpCtx = this.tmpCanvasEl.getContext("2d");
    if (!tmpCtx) {
      throw new Error("Unable to get 2D context from temporary canvas.");
    }
    tmpCtx.clearRect(0, 0, this.tmpCanvasEl.width, this.tmpCanvasEl.height);
    tmpCtx.drawImage(this.getElement(), -i * this.spriteWidth, 0);
    const dataURL = this.tmpCanvasEl.toDataURL("image/png");
    const tmpImg = fabric.util.createImage() as HTMLImageElement;
    tmpImg.src = dataURL;
    this.spriteImages.push(tmpImg);
  }

  _render(ctx: CanvasRenderingContext2D): void {
    const currentSprite = this.spriteImages[this.spriteIndex];
    if (currentSprite) {
      ctx.drawImage(currentSprite, -this.width / 2, -this.height / 2);
    }
  }

  play(): void {
    this.animInterval = window.setInterval(() => {
      if (this.onPlay) {
        this.onPlay();
      }
      this.dirty = true;
      this.spriteIndex++;
      if (this.spriteIndex >= this.spriteImages.length) {
        this.spriteIndex = 0;
      }
    }, this.frameTime);
  }

  stop(): void {
    if (this.animInterval) {
      clearInterval(this.animInterval);
      this.animInterval = undefined;
    }
  }

  static fromURL<T extends Partial<fabric.ImageProps>>(
    url: string,
    options?: { crossOrigin?: string | null },
    imageOptions?: T
  ): Promise<Sprite> {
    const crossOrigin =
      options && options.crossOrigin === null ? undefined : options?.crossOrigin;
    const fabricOptions = { crossOrigin } as { crossOrigin?: "anonymous" | "use-credentials" };

    return fabric.util.loadImage(url, fabricOptions)
      .then((img: HTMLImageElement) => new Sprite(img, imageOptions));
  }
}
