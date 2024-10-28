class Heap<T> {
  private heap: T[];
  constructor(private compare: (a: T, b: T) => number) {
    this.heap = [];
  }

  get size(): number {
    return this.heap.length;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  push(val: T): void {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }
    if (this.size === 1) {
      return this.heap.pop();
    }
    const result = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return result;
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[parentIndex], this.heap[index]) <= 0) break;

      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number) {
    while (true) {
      let minIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      if (leftChild < this.size && this.compare(this.heap[leftChild], this.heap[minIndex]) < 0) {
        minIndex = leftChild;
      }
      if (rightChild < this.size && this.compare(this.heap[rightChild], this.heap[minIndex]) < 0) {
        minIndex = rightChild;
      }
      if (minIndex == index) break;

      [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
      index = minIndex;
    }
  }

  toArray(): Array<T> {
    return [...this.heap];
  }
}
