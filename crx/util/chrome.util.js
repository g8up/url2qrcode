/**
 * Chrome 本地存储
 */
class Store {
  constructor(key){
    this.key = key;
  }

  get() {
    const key = this.key;
    return new Promise((resolve, reject)=>{
      chrome.storage?.sync.get(key, data => {
        let d = data[key];
        resolve(d);
      });
    });

  }

  set(data) {
    const key = this.key;
    return new Promise((resolve, reject)=>{
      if (data) {
        chrome.storage.sync.set({
          [key]: data
        }, () => {
          resolve();
        });
      }
      else{
        reject();
      }
    });
  }
}