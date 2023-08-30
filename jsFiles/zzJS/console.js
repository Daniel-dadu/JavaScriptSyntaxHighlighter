'use strict';

require('../common');

console.trace('foo');

Blockly.JavaScript["change_text"] = function (block) {
    var value_text = Blockly.JavaScript.valueToCode(
      block,
      "text",
      Blockly.JavaScript.ORDER_ATOMIC
    );
    var value_element = Blockly.JavaScript.valueToCode(
      block,
      "element",
      Blockly.JavaScript.ORDER_NONE
    );
    // TODO: Assemble JavaScript into code variable.
    var code = "$(" + value_element + ").text(" + value_text + ");\n";
    return code;
  };