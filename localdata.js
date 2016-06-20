/**
 * @fileoverview 封装了html5 localstorage 和IE6+ UserData本地存储.
 * @author corrupter@yeah.net 2014-08-05 17:13
 */
if (!window.localData) {
  window.localData = {
      hname: location.hostname?location.hostname:'localStatus',
      isLocalStorage: window.localStorage?true:false,
      _dataDom:null,
      _ttlKey: 'local:to',
      _ttl: null,
      _inited: false,
      _data: {},
  
      getTimestamp: function() {return Math.floor((new Date()).getTime()/1000);},
      _addTtl: function(key, ttl) {
          if (ttl <= this.getTimestamp()) {
              this.remove(key);
              return;
          }
          this._ttl[key] = ttl;
          this._set(this._ttlKey, JSON.stringify(this._ttl));
      },
      _getTtl: function(key) {
          return key ? this._ttl[key] : this._ttl;
      },
      _delTtl: function(key) {
          delete this._ttl[key];
          this._set(this._ttlKey, JSON.stringify(this._ttl));
      },
      init: function() {
          if (this._inited) return;
          var ttl = this._get(this._ttlKey);
          this._ttl = ttl ? JSON.parse(ttl) : {};
          for (var k in this._ttl) {
              if (isNaN(parseInt(this._ttl[k]))) continue;
              if (parseInt(this._ttl[k]) <= this.getTimestamp()) {
                  this.remove(k);
              }
          }
          this._inited = true;
      },
  
      initDom:function(){
          if (!this._dataDom) {
              try {
                  this._dataDom = document.createElement('input');
                  this._dataDom.type = 'hidden';
                  this._dataDom.style.display = "none";
                  this._dataDom.addBehavior('#default#userData');
                  document.body.appendChild(this._dataDom);
                  var exDate = new Date();
                  exDate = exDate.getDate()+30;
                  this._dataDom.expires = exDate.toUTCString();
              } catch(ex) {
                  return false;
              }
          }
          return true;
      },
      _set: function(key, value) {
          if(this.isLocalStorage){
              window.localStorage.setItem(key,value);
          } else if(this.initDom()){
              this._dataDom.load(this.hname);
              this._dataDom.setAttribute(key,value);
              this._dataDom.save(this.hname)
          } else {
              this._data[key] = value;
          }
      },
      set:function(key, value, ttl){
          this._set(key, value);
          if (!isNaN(parseInt(ttl))) {this._addTtl(key, this.getTimestamp() + ttl);}
      },
      mset:function(key, value, ttl) {
          if (typeof value !== 'string') {
              value = JSON.stringify(value);
          }
          this.set(key, value, ttl);
      },
      _get:function(key){
          if(this.isLocalStorage){
              return window.localStorage.getItem(key);
          }else if(this.initDom()){
              this._dataDom.load(this.hname);
              return this._dataDom.getAttribute(key);
          } else {
              return this._data[key];
          }
      },
      get: function(key) {
          var ttl = this._getTtl(key);
          if (ttl && ttl <= this.getTimestamp()) {
              this.remove(key);
              return null;
          }
          return this._get(key);
      },
      mget: function(key) {
          var val = this.get(key);
          return val == null ? null : JSON.parse(val);
      },
      _remove:function(key){
          if(this.isLocalStorage){
              window.localStorage.removeItem(key);
          }else if(this.initDom()){
              this._dataDom.load(this.hname);
              this._dataDom.removeAttribute(key);
              this._dataDom.save(this.hname)
          } else {
              delete this._data[key];
          }
      },
      remove:function(key) {
          this._remove(key);
          this._delTtl(key);
      },
      clear: function() {
          if(this.isLocalStorage){
              window.localStorage.clear();
          }else if(this.initDom()){
              this._dataDom.load(this.hname);
              var exDate = (new Date()).getDate()-1;
              this._dataDom.expires = exDate.toUTCString();
              this._dataDom.save(this.hname);
              delete this._dataDom;
          } else {
              this._data = {};
              this._ttl = {};
          }
      }
  };
  localData.init();
}
