class QEnv {
  constructor() {
    this.env = fetch('/env')
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw response;
        }
      })
      .catch(() => {
        this.env = null;
      })
  }
}

const qEnv = new QEnv();

let proxy = new Proxy(qEnv, {
  get: function(target, name, receiver) {
    return target.env
      .then(env => {
        return env[name]; 
      })
  }
})

export default proxy;
