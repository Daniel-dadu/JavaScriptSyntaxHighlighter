Mandrill.prototype.onerror = function(err) {
    throw {
      name: err.name,
      message: err.message,
      toString: function() {
        return "" + err.name + ": " + err.message;
      }
    };
  };

  return Mandrill;

})();

Templates = (function() {

  function Templates(master) {
    this.master = master;
  }
  Templates.prototype.add = function(params, onsuccess, onerror) {
    var _ref;
    if (params == null) {
      params = {};
    }
    if (typeof params === 'function') {
      onerror = onsuccess;
      onsuccess = params;
      params = {};
    }
    if ((_ref = params["publish"]) == null) {
      params["publish"] = true;
    }
    return this.master.call('templates/add', params, onsuccess, onerror);
  };
  Templates.prototype.info = function(params, onsuccess, onerror) {
    if (params == null) {
      params = {};
    }
    if (typeof params === 'function') {
      onerror = onsuccess;
      onsuccess = params;
      params = {};
    }
    return this.master.call('templates/info', params, onsuccess, onerror);
  }; Templates.prototype.update = function(params, onsuccess, onerror) {
    var _ref;
    if (params == null) {
      params = {};
    }
    if (typeof params === 'function') {
      onerror = onsuccess;
      onsuccess = params;
      params = {};
    }
    if ((_ref = params["publish"]) == null) {
      params["publish"] = true;
    }
    return this.master.call('templates/update', params, onsuccess, onerror);
  };
