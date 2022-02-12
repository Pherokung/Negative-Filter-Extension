class Node {
  constructor(key, value) {
    if (typeof key !== 'undefined' || typeof key !== null) {
      this.key = key
    }
    if (typeof value !== 'undefined' || typeof value !== null) {
      this.value = value
    }
    this.next = null
    this.prev = null
  }
}


class Cache {
  constructor(limit = 100) {
    if (typeof limit === 'number') {
      this._limit = limit
    }
    this._size = 0
    this._map = {}
    this._head = null
    this._tail = null
  }

  setHead(node) {
    node.next = this._head
    node.prev = null
    // if head exists
    if (this._head !== null) {
      this._head.prev = node
    }
    this._head = node
    // if tail does not exist
    if (this._tail === null) {
      this._tail = node
    }
    this._size++
    this._map[node.key] = node
  }

  // return an item from the cache
  get(key) {
    if (this._map[key]) {
      const value = this._map[key].value
      const node = new Node(key, value)
      this.remove(key)
      this.setHead(node)
      return value
    }
  }

  // add an item to the cache. overwrite if already exists
  set(key, value) {
    const node = new Node(key, value)
    if (this._map[key]) {
      this.remove(key)
    } else {
      // if cache is full
      if (this._size >= this._limit) {
        delete this._map[this._tail]
        this._size--
        this._tail = this._tail.prev
        this._tail.next = null
      }
    }
    this.setHead(node)
  }

  // remove an item from the cache
  remove(key) {
    if(this._map[key]) {
      const node = this._map[key]
      // update head and tail
      if (node.prev !== null) {
        node.prev.next = node.next
      } else {
        this._head = node.next
      }
      if (node.next !== null) {
        node.next.prev = node.prev
      } else {
        this._tail = node.prev
      }
      // actually do the removal stuff
      delete this._map[key]
      this._size--
    }
  }

  // reset the cache to an empty and fresh state
  clear(limit = 10) {
    if (typeof limit === 'number') this._limit = limit
    this._size = 0
    this._map = {}
    this._head = null
    this._tail = null
  }

  // Traverse each cached item and call a function
  // callback is passed [node element, element number, cache instance] 
  forEach(callback) {
    let node = this._head
    let i = 0
    while (node) {
      callback.apply(this, [node, i, this])
      i++
      node = node.next
    }
  }

  // return a JSON represenation of the cache
  toJSON() {
    let json = []
    let node = this._head
    while (node) {
      let data = {
        key: node.key,
        value: node.value
      }
      json.push(data)
      node = node.next
    }
    return json
  }
}



(function() {
    let cache = new Cache()
    let node = new Node()
    cache._limit = 100
    

    function test(a) {
        if (a.tagName === "SPAN" && a.innerText && a.children.length === 0) {
            let req = new XMLHttpRequest();
            req.open('POST', 'https://predict-sentiment-pyqht6v3wa-de.a.run.app/predict');
            req.setRequestHeader('Content-Type', 'application/json');

            req.onload = function() {
                if(cache.get(a.innerText) == undefined){
                    let response = JSON.parse(req.responseText).prediction;
                    console.log(a.innerText)
                    console.log("response is")
                    console.log(response)
                    console.log(cache._size)
                    console.log(cache.get(a.innerText))
                    console.log("---------")    
                    
                    if (response == 'Negative') {
                        cache.set(a.innerText,1)
                        el = findUpTag(a, "ARTICLE")
                        el.style.filter = "blur(10px)"
                    } 
                    else{
                        cache.set(a.innerText,0)
                    }    
                }
                
            }

            if(a.innerText.length >= 20){
                //console.log(a.innerText)
                //console.log("val = ")
                //console.log(val)
                //console.log('==============')
                if(cache.get(a.innerText) == undefined){
                    let sendData = JSON.stringify(
                        {
                            "text": a.innerText
                        }
                    );
                    //console.log(sendData)
                    req.send(sendData);      
                }
                else if(cache.get(a.innerText) == 1){
                    el = findUpTag(a, "ARTICLE")
                    el.style.filter = "blur(10px)"
                }
            }
        }
    }

    function findUpTag(el, tag) {
        while (el.parentNode) {
            el = el.parentNode;
            if (el.tagName === tag)
                return el;
        }
        return null;
    }

    function allDescendants(node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            allDescendants(child);
            test(child);
        }
    }

    const interval = setInterval(function() {
        var all = document.getElementsByTagName("article");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i].style.filter === "") {
                allDescendants(all[i])
            }
        }
    }, 250);

})();