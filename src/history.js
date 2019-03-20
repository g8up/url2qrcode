// history

class History {
  constructor( {node, store,} ) {
    this.node = node;
    this.store = store;
  }

  render(){
    return this.store.get().then( (data = {}) =>{
      const list = Object.keys( data ).map( text => {
        return {
          text,
          timestamp: data[text],
        };
      });
      let html;
      if( list.length ){
        html = list.sort((t1, t2)=>{
          return t2.timestamp - t1.timestamp;
        }).slice().map( record=>{
          return `<li>
            <span class="delete">&times;</span>
            <span class="text">${record.text}</span>
            </li>`;
        }).join('');
      }
      else{
        html = `<li>暂无数据</li>`;
      }
      this.node.innerHTML = html;
    });
  }

  bindEvent( handle ){
    this.node.addEventListener('click', (e)=>{
      const {
        target,
      } = e;
      const classList = target.classList;
      if( classList.contains('text')){
        const {
          textContent,
        } = target;
        handle( textContent );
      }
      else if( classList.contains('delete') ){
        const text = target.parentNode.querySelector('.text').textContent;
        this.delete( text ).then(()=>{
          this.render();
        });
      }
    });
  }

  saveRecord( text ){
    return this.store.get().then( (data = {}) =>{
      data[text] = + new Date(); // 用于排序
      return this.store.set(data);
    });
  };

  clearAll(){
    return this.store.set({});
  }

  delete( text ){
    return this.store.get().then( (data = {}) =>{
      delete data[text];
      return this.store.set(data);
    });
  }
}