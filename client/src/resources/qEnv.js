class QEnv {
  constructor() {
    this.env = this.load();
  }

  async load() {
    try {
      const response = await fetch("/env");
      if (!response.ok) {
        throw response;
      }
      return await response.json();
    } catch (e) {
      return null;
    }
  }
}

const qEnv = new QEnv();

let proxy = new Proxy(qEnv, {
  get: function(target, name, receiver) {
    return target.env.then(env => {
      return env[name];
    });
  }
});

export default proxy;
