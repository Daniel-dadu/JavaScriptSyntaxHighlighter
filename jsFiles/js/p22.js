Senders.prototype.info = function (params, onsuccess, onerror) {
  if (params == null) {
    params = {};
  }
  if (typeof params === "function") {
    onerror = onsuccess;
    onsuccess = params;
    params = {};
  }
  return this.master.call("senders/info", params, onsuccess, onerror);
};

Senders.prototype.timeSeries = function (params, onsuccess, onerror) {
  if (params == null) {
    params = {};
  }
  if (typeof params === "function") {
    onerror = onsuccess;
    onsuccess = params;
    params = {};
  }
  return this.master.call("senders/time-series", params, onsuccess, onerror);
};
