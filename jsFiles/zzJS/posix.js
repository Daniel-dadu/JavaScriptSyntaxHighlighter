'use strict';

module.exports = require('path').posix;

Blockly.JavaScript["range_slider_move"] = function (block) {
    var value_move = Blockly.JavaScript.valueToCode(
      block,
      "move",
      Blockly.JavaScript.ORDER_ATOMIC
    );
    var value_name = Blockly.JavaScript.valueToCode(
      block,
      "name",
      Blockly.JavaScript.ORDER_ATOMIC
    );
    // TODO: Assemble JavaScript into code variable.
    var code =
      "$( document ).ready(function() { swiper_func_" +
      value_name +
      "('" +
      value_name +
      "', " +
      value_move +
      "); });" +
      " $('[name=" +
      value_name +
      "]').on('input', function () { swiper_func_" +
      value_name +
      "('" +
      value_name +
      "', " +
      value_move +
      "); });" +
      "function swiper_func_" +
      value_name +
      " (name, swiper) { name = '[name=' + name + ']';" +
      " var range = $(name).val(); range = parseFloat(range);" +
      " var width = $(name).width() - 10; var range_max = $(name).attr('max');" +
      " width = width / range_max; width = width * (range - 1); " +
      " $(swiper).css({ transform: 'translateX(' + width + 'px)' });  }";
    return code;
  };