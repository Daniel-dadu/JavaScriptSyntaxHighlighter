'use strict';

module.exports = require('path').win32;

Blockly.JavaScript["airtable"] = function (block) {
    var value_table = Blockly.JavaScript.valueToCode(
      block,
      "table",
      Blockly.JavaScript.ORDER_ATOMIC
    );
  
    var statements_fields = Blockly.JavaScript.statementToCode(block, "fields");
    var statements_do = Blockly.JavaScript.statementToCode(block, "do");
    // TODO: Assemble JavaScript into code variable.
    var code =
      "var settings = {\nasync: true,\ncrossDomain: true,\n" +
      'url:"https://api.airtable.com/v0/"+airtable_base+"/"+' +
      value_table +
      '+"?api_key="+airtable_key,' +
      '\nmethod: "POST", \nheaders: { "content-type": "application/json"' +
      "},\nprocessData: false,\n" +
      'data: `{"records": [{"fields": {' +
      statements_fields +
      "}}]}`};\n" +
      "$.ajax(settings).done(function (val) {\n" +
      statements_do +
      "});";
    code = code.replaceAll(",\n}}]}", "\n}}]}");
    code = code.replaceAll(",}}]}", "}}]}");
    return code;
  };