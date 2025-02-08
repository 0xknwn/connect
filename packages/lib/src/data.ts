type callback = (value: number) => void;

class dataClass {
  value: number;
  callbacks: callback[];
  addCallbacks: (c: callback) => void = () => {};
  setValue: (value: number) => void;
  constructor() {
    this.value = 0;
    this.callbacks = [];
    this.addCallbacks = (c: callback) => {
      this.callbacks.push(c);
    };
    this.setValue = (value: number) => {
      this.value = value;
      this.callbacks.forEach((callback) => callback(this.value));
    };
  }
}

export const data = new dataClass();
