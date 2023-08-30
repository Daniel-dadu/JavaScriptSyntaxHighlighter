var Marker = (mxn.Marker = function (point) {
  this.api = null;
  this.location = point;
  this.onmap = false;
  this.proprietary_marker = false;
  this.attributes = [];
  this.invoker = new mxn.Invoker(this, "Marker", function () {
    return this.api;
  });
  mxn.addEvents(this, [
    "openInfoBubble", // Info bubble opened
    "closeInfoBubble", // Info bubble closed
    "click", // Marker clicked
    "dragend", // Marker moved
  ]);
});

Marker.prototype.addData = function (options) {
  for (var sOptKey in options) {
    if (options.hasOwnProperty(sOptKey)) {
      switch (sOptKey) {
        case "label":
          this.setLabel(options.label);
          break;
        case "infoBubble":
          this.setInfoBubble(options.infoBubble);
          break;
        case "icon":
          if (options.iconSize && options.iconAnchor) {
            this.setIcon(options.icon, options.iconSize, options.iconAnchor);
          } else if (options.iconSize) {
            this.setIcon(options.icon, options.iconSize);
          } else {
            this.setIcon(options.icon);
          }
          break;
        case "iconShadow":
          if (options.iconShadowSize) {
            this.setShadowIcon(options.iconShadow, [
              options.iconShadowSize[0],
              options.iconShadowSize[1],
            ]);
          } else {
            this.setIcon(options.iconShadow);
          }
          break;
        case "infoDiv":
          this.setInfoDiv(options.infoDiv[0], options.infoDiv[1]);
          break;
        case "draggable":
          this.setDraggable(options.draggable);
          break;
        case "hover":
          this.setHover(options.hover);
          this.setHoverIcon(options.hoverIcon);
          break;
        case "hoverIcon":
          this.setHoverIcon(options.hoverIcon);
          break;
        case "openBubble":
          this.openBubble();
          break;
        case "closeBubble":
          this.closeBubble();
          break;
        case "groupName":
          this.setGroupName(options.groupName);
          break;
        default:
          // don't have a specific action for this bit of
          // data so set a named attribute
          this.setAttribute(sOptKey, options[sOptKey]);
          break;
      }
    }
  }
};
