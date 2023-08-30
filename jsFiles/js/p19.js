
    Users.prototype.senders = function(params, onsuccess, onerror) {
        if (params == null) {
          params = {};
        }
        if (typeof params === 'function') {
          onerror = onsuccess;
          onsuccess = params;
          params = {};
        }
        return this.master.call('users/senders', params, onsuccess, onerror);
      };
  
      return Users;
  
    })();
  
    Rejects = (function() {
  
      function Rejects(master) {
        this.master = master;
      }
      Rejects.prototype.list = function(params, onsuccess, onerror) {
        var _ref, _ref1;
        if (params == null) {
          params = {};
        }
        if (typeof params === 'function') {
          onerror = onsuccess;
          onsuccess = params;
          params = {};
        }
        if ((_ref = params["email"]) == null) {
          params["email"] = null;
        }
        if ((_ref1 = params["include_expired"]) == null) {
          params["include_expired"] = false;
        }
        return this.master.call('rejects/list', params, onsuccess, onerror);
      }; 
      Rejects.prototype["delete"] = function(params, onsuccess, onerror) {
        if (params == null) {
          params = {};
        }
        if (typeof params === 'function') {
          onerror = onsuccess;
          onsuccess = params;
          params = {};
        }
        return this.master.call('rejects/delete', params, onsuccess, onerror);
      };
  
      return Rejects;
  
    })();  