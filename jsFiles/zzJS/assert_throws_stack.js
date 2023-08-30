'use strict';

require('../common');
const assert = require('assert').strict;

assert.throws(() => { throw new Error('foo'); }, { bar: true });

Blockly.JavaScript["get_checkbox"] = function (block) {
    var value_value = Blockly.JavaScript.valueToCode(
      block,
      "value",
      Blockly.JavaScript.ORDER_ATOMIC
    );
    var statements_name = Blockly.JavaScript.statementToCode(block, "NAME");
    // TODO: Assemble JavaScript into code variable.
    var code =
      "var value_string = varToString({ " +
      value_value +
      " });\n" +
      "$('[name='+value_string+']').on('input',function() {" +
      value_value +
      " = $(this).val(); if($(this).is(':checkbox')) { " +
      value_value +
      "= !$(this).siblings('.w-checkbox-input').hasClass('w--redirected-checked'); }" +
      "if($.isNumeric(" +
      value_value +
      ")) { " +
      value_value +
      " = parseFloat(" +
      value_value +
      "); } " +
      statements_name +
      "});" +
      '$("label.w-radio").on("click", function () {' +
      "if ($(this).children('[name=" +
      value_value +
      "]').length != 0) {" +
      value_value +
      " = $('[name='+value_string+']', this).val();\n}\n" +
      "});";
    // '$("label.w-checkbox").on("click", function () {' +
    // "if ($(this).children('[data-name=" +
    // value_value +
    // "]').length != 0) {" +
    // value_value +
    // " = !$('.w-checkbox-input',this).hasClass('w--redirected-checked');\n " +
    // statements_name +
    // " }\n" +
    // "});";
    return code;
  };