function $m() {
  var elements = [];
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == "string") {
      element = document.getElementById(element);
    }
    if (arguments.length == 1) {
      return element;
    }
    elements.push(element);
  }
  return elements;
}
function loadScript(src, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  if (callback) {
    var evl = {};
    evl.handleEvent = function (e) {
      callback();
    };
    script.addEventListener("load", evl, true);
  }
  document.getElementsByTagName("head")[0].appendChild(script);
  return;
}
function convertLatLonXY_Yahoo(point, level) {
  //Mercator
  var size = 1 << (26 - level);
  var pixel_per_degree = size / 360.0;
  var pixel_per_radian = size / (2 * Math.PI);
  var origin = new YCoordPoint(size / 2, size / 2);
  var answer = new YCoordPoint();
  answer.x = Math.floor(origin.x + point.lon * pixel_per_degree);
  var sin = Math.sin((point.lat * Math.PI) / 180.0);
  answer.y = Math.floor(
    origin.y + 0.5 * Math.log((1 + sin) / (1 - sin)) * -pixel_per_radian
  );
  return answer;
}
function loadStyle(href) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = href;
  document.getElementsByTagName("head")[0].appendChild(link);
  return;
}
