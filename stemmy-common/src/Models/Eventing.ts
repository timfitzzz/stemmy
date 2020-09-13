type Callback = () => void;

export class Eventing {
  events: { [key: string]: Callback[] } = {};

  on = (eventName: string, callback: Callback): Callback => {
    const handlers = this.events[eventName] || [];
    handlers.push(callback);
    this.events[eventName] = handlers;
    return callback;
  };

  remove = (eventName: string, callback: Callback): void => {
    const indexToRemove = this.events[eventName].indexOf(callback);
    if (indexToRemove > -1) {
      this.events[eventName].splice(indexToRemove, 1);
    }
  };

  trigger = (eventName: string): void => {
    const handlers = this.events[eventName] || [];
    handlers.forEach((callback) => {
      callback();
    });
  };
}
