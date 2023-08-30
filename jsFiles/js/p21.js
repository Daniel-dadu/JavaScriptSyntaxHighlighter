Messages.prototype.search = function (params, onsuccess, onerror) {
  var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
  if (params == null) {
    params = {};
  }
  if (typeof params === "function") {
    onerror = onsuccess;
    onsuccess = params;
    params = {};
  }
  if ((_ref = params["query"]) == null) {
    params["query"] = "*";
  }
  if ((_ref1 = params["date_from"]) == null) {
    params["date_from"] = null;
  }
  if ((_ref2 = params["date_to"]) == null) {
    params["date_to"] = null;
  }
  if ((_ref3 = params["tags"]) == null) {
    params["tags"] = null;
  }
  if ((_ref4 = params["senders"]) == null) {
    params["senders"] = null;
  }
  if ((_ref5 = params["limit"]) == null) {
    params["limit"] = 100;
  }
  return this.master.call("messages/search", params, onsuccess, onerror);
};

Messages.prototype.parse = function (params, onsuccess, onerror) {
  if (params == null) {
    params = {};
  }
  if (typeof params === "function") {
    onerror = onsuccess;
    onsuccess = params;
    params = {};
  }
  return this.master.call("messages/parse", params, onsuccess, onerror);
};

Messages.prototype.sendRaw = function (params, onsuccess, onerror) {
  var _ref, _ref1, _ref2, _ref3;
  if (params == null) {
    params = {};
  }
  if (typeof params === "function") {
    onerror = onsuccess;
    onsuccess = params;
    params = {};
  }
  if ((_ref = params["from_email"]) == null) {
    params["from_email"] = null;
  }
  if ((_ref1 = params["from_name"]) == null) {
    params["from_name"] = null;
  }
  if ((_ref2 = params["to"]) == null) {
    params["to"] = null;
  }
  if ((_ref3 = params["async"]) == null) {
    params["async"] = false;
  }
  return this.master.call("messages/send-raw", params, onsuccess, onerror);
};
