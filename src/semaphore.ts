export function Semaphore(max: number): any {
  let counter = 0;
  let waiting = [];

  const take = () => {
    if (waiting.length > 0 && counter < max) {
      counter++;
      const promise = waiting.shift();
      promise.resolve();
    }
  }

  this.acquire = ():Promise<[]> => {
    if (counter < max) {
      counter++
      return new Promise(resolve => {
        resolve();
      });
    } else {
      return new Promise((resolve, err) => {
        waiting.push({ resolve, err });
      });
    }
  }

  this.release = () => {
    counter--;
    take();
  }

  this.purge = (): number => {
    const unresolved = waiting.length;

    for (let i = 0; i < unresolved; i++) {
      waiting[i].err('Task has been purged.');
    }

    counter = 0;
    waiting = [];

    return unresolved;
  }
}
