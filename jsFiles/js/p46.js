var PubSub, fullscreen, wptitlehint;

PubSub = function () {
  this.topics = {};
};

PubSub.prototype.subscribe = function (topic, callback) {
  if (!this.topics[topic]) this.topics[topic] = [];

  this.topics[topic].push(callback);
  return callback;
};

PubSub.prototype.unsubscribe = function (topic, callback) {
  var i,
    l,
    topics = this.topics[topic];

  if (!topics) return callback || [];

  // Clear matching callbacks
  if (callback) {
    for (i = 0, l = topics.length; i < l; i++) {
      if (callback == topics[i]) topics.splice(i, 1);
    }
    return callback;

    // Clear all callbacks
  } else {
    this.topics[topic] = [];
    return topics;
  }
};

PubSub.prototype.publish = function (topic, args) {
  var i,
    l,
    broken,
    topics = this.topics[topic];

  if (!topics) return;

  args = args || [];

  for (i = 0, l = topics.length; i < l; i++) {
    broken = topics[i].apply(null, args) === false || broken;
  }
  return !broken;
};
