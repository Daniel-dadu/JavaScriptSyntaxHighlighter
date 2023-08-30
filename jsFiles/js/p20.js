Inbound.prototype.sendRaw = function(params, onsuccess, onerror) {
    var _ref;
    if (params == null) {
      params = {};
    }
    if (typeof params === 'function') {
      onerror = onsuccess;
      onsuccess = params;
      params = {};
    }
    if ((_ref = params["to"]) == null) {
      params["to"] = null;
    }
    return this.master.call('inbound/send-raw', params, onsuccess, onerror);
  };

  return Inbound;

})();

Tags.prototype["delete"] = function(params, onsuccess, onerror) {
    if (params == null) {
      params = {};
    }
    if (typeof params === 'function') {
      onerror = onsuccess;
      onsuccess = params;
      params = {};
    }
    return this.master.call('tags/delete', params, onsuccess, onerror);
  };
