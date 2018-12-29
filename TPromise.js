/**
 * author tanjian917@gmail.com
 * date 2018-12-29
 * version v0.0.1
 */
(function(_global){
  function TPromise(callback){
    let _this = this;
    this._cbs = [];
    this._result = null;
    this.status = 'pending';
    
    function resolve(data){
      _this._result = {
        type: 0,
        data
      };
      _this.status = 'resolved';
      _this.__dispatchCb.call(_this);
    }

    function reject(data){
      _this._result = {
        type: 1,
        data
      };
      _this.status = 'reject';
      _this.__dispatchCb.call(_this);
    }
    
    setTimeout(function(){
      try{
        callback.apply(_this,[resolve,reject]);
      }catch(err){
        reject(err);
      }    
    },0);

    return this;
  }

  TPromise.prototype._TYPE_THEN = 0;
  TPromise.prototype._TYPE_CATCH = 1;
  TPromise.prototype._TYPE_FINALLY = 2;
  
  TPromise.prototype.__dispatchCb = function(){
    let {type,data} = this._result,sThen = (type==0),_cbs = this._cbs;
    while(_cbs.length){
      let cbItem = _cbs.splice(0,1)[0],statuType = cbItem.type;
      if(sThen && statuType === this._TYPE_THEN){
        // call then function
        data = cbItem.cb(data);
        this._result.data = data;
      }else if(!sThen && statuType === this._TYPE_CATCH){
        // call catch function
        data = cbItem.cb(data);
        this._result.data = data;
      }else if(cbItem.type === this._TYPE_FINALLY){
        // call finally function
        cbItem.cb()
      }
      if(!sThen)sThen = (cbItem.type==1);
    }
  }

  TPromise.prototype.then = function(resolve,reject){
    if((typeof resolve) === 'function')this._cbs.push({
      type: this._TYPE_THEN,
      cb: resolve
    });
    if((typeof reject) === 'function')this.catch(reject);
    if(this._result)this.__dispatchCb(this._TYPE_THEN);
    return this;
  }

  TPromise.prototype.catch = function(callback){
    if((typeof callback) === 'function')this._cbs.push({
      type: this._TYPE_CATCH,
      cb: callback
    });
    if(this._result)this.__dispatchCb(this._TYPE_CATCH);
    return this;
  }

  TPromise.prototype.finally = function(callback){
    if((typeof callback) === 'function')this._cbs.push({
      type: this._TYPE_FINALLY,
      cb: callback
    });
    if(this._result)this.__dispatchCb(this._TYPE_FINALLY);
    return this;
  };

  TPromise.resolve = function(val){
    return new TPromise((resolve,reject)=>{
      resolve(val);
    });
  }
  TPromise.reject = function(val){
    return new TPromise((resolve,reject)=>{
      reject(val);
    });
  }

  TPromise.race = function(promises){
    let filterPromises = [];
    let formataPromise = function(promise){
      if(!(promise instanceof TPromise) && !(promise instanceof Promise))return TPromise.resolve(promise);
      return promise;
    }
    if(promises instanceof Array){
      for(let i=0,len=promises.length;i<len;i++){
        filterPromises.push(formataPromise(promises[i]));
      }
    }else filterPromises.push(formataPromise(promises));
    let hasThen = true;
    return new Promise((resolve,reject)=>{
      let eIndex = filterPromises.length;
      for(let i=0;i<eIndex;i++){
        let promise = filterPromises[i];
        promise.then(result=>{
          if(hasThen){
            hasThen = false;
            resolve(result);
          }
        });
      }
    });
  }

  TPromise.all = function(promises){
    let filterPromises = [];
    let formataPromise = function(promise){
      if(!(promise instanceof TPromise))return TPromise.resolve(promise);
      return promise;
    }
    if(promises instanceof Array){
      for(let i=0,len=promises.length;i<len;i++){
        filterPromises.push(formataPromise(promises[i]));
      }
    }else filterPromises.push(formataPromise(promises));

    return new TPromise((resolve,reject)=>{
      let isResolve = true,results = [],eIndex = filterPromises.length;
      let iteratorPromise = function(iIndex){
        if(iIndex>=eIndex){
          if(isResolve)resolve(results);
          else reject(results);
          return;
        }
        
        let promise = filterPromises[iIndex];
        promise.then(result=>{
          results.push(result);
          return result;
        }).catch(err=>{
          results.push(err);
          isResolve = false;
          return err;
        }).finally(()=>{
          iIndex ++;
          iteratorPromise(iIndex);
        })
      }
      iteratorPromise(0);
    });
  }

  _global.TPromise = TPromise;
})(global || window);