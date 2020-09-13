import { AxiosPromise, AxiosResponse } from 'axios';
import { hasId } from './ApiSync';
import fs from 'fs';

type Callback = () => void;

interface ModelAttributes<T extends hasId> {
  set(update: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: Callback): Callback;
  remove(eventName: string, callback: Callback): void;
  trigger(eventName: string): void;
}

export class Model<T extends hasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private sync: Sync<T>,
    private events: Events
  ) {}

  on = this.events.on;

  remove = this.events.remove;

  trigger = this.events.trigger;

  get = this.attributes.get;

  set(update: T): void {
    this.attributes.set(update);
    this.events.trigger('change');
  }

  fetch = (): void => {
    const id = this.attributes.get('id');

    if (typeof id !== 'number') {
      throw new Error('Cannot fetch without an id');
    }

    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data);
    });
  };

  save(): void {
    const that = this;
    const currentAttributes = this.attributes.getAll();
    this.sync
      .save(currentAttributes)
      .then((response: AxiosResponse): void => {
        const data: T = response.data;
        // const { id: number } = data;
        // const test: T = data;
        // @ts-ignore : TODO: why doesn't this work
        that.attributes.set({ id: data.id });
        this.trigger('save');
      })
      .catch((err) => {
        console.log(err);
        this.trigger(`error: ${err}`);
      });
  }
}
