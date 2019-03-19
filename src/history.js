// history

class History {
  constructor( {node, store,} ) {
    this.node = node;
    this.store = store;
  }

  render(){
    return this.store.get().then( (list=[]) =>{
      this.node.innerHTML = list.map( record=>{
        return `<li>${record}</li>`;
      }).join('');
    });
  }

  bindEvent( handle ){
    this.node.addEventListener('click', (e)=>{
      const {
        target,
      } = e;
      const {
        textContent,
      } = target;
      handle( textContent );
    });
  };

}