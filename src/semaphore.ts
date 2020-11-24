class Semaphore {
  max: number;
  constructor(max:number) {
    this.max = max
  }

  private waiting: any[] = [];
  private counter: number = 0;
  private take() {
    if (this.waiting.length > 0 && this.counter < this.max) {
      this.counter++;
      const promise = this.waiting.shift();
      promise.resolve();
    }
  }
  public acquire() {
    if (this.counter < this.max) {
      this.counter++
      return new Promise(resolve => {
        resolve();
      });
    } else {
      return new Promise((resolve, err) => {
        this.waiting.push({ resolve, err });
      });
    }
  }
  public release() {
    this.counter--;
    this.take();
  }

  public purge() {
      const unresolved = this.waiting.length;
      for (let i = 0; i < unresolved; i++) {
        this.waiting[i].err('Task has been purged.');
      }
      this.counter = 0;
      this.waiting = [];

      return unresolved;
    }


}

export { Semaphore }
