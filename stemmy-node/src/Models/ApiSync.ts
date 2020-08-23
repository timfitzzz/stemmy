import axios, { AxiosPromise } from 'axios';
import { AudioFileReader } from '../util/AudioFileReader';

const apiRootUrl = 'http://localhost:3000/';

export interface hasId {
  id?: number;
  [key: string]: any;
}

interface apiSyncOptions {
  doNotSync: string[];
}

export class ApiSync<T extends hasId> {
  constructor(public modelSlug: string, public options?: apiSyncOptions) {}

  fetch(id: number): AxiosPromise {
    return axios.get(`${apiRootUrl}${this.modelSlug}/${id}`);
  }

  save(data: T): any {
    const { id } = data;
    const filteredData: T = Object.assign({}, data);

    if (this.options && this.options.doNotSync) {
      this.options.doNotSync.forEach((unsyncedProp: string): void => {
        delete filteredData[unsyncedProp];
      });
    }

    if (id) {
      return axios.put(`${apiRootUrl}${this.modelSlug}/${id}`, filteredData);
    } else {
      return axios.post(`${apiRootUrl}${this.modelSlug}`, filteredData);
    }
  }
}
