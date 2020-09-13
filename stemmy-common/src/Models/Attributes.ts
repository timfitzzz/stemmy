import { hasId } from './ApiSync';

export class Attributes<T extends hasId> {
  constructor(private data: T) {}

  get = <K extends keyof T>(key: K): T[K] => {
    return this.data[key];
  };

  set(update: T): void {
    Object.assign(this.data, update);
  }

  getAll = (): T => {
    return this.data;
  };
}
