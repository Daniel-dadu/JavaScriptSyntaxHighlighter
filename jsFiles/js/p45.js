function replaceSpecialChars(value) {
  //Ti.API.info('value:'+value);
  if (
    value != null &&
    value != "0" &&
    value != "" &&
    value != "undefined" &&
    value.toString().indexOf("'") > 0
  ) {
    value = value.replace(/'/g, "''");
  }

  return value;
}

function ConvertDateToString(date) {
  var currentDate = new Date(date);
  var twoDigitMonth =
    currentDate.getMonth() + 1 >= 10
      ? currentDate.getMonth() + 1
      : "0" + (currentDate.getMonth() + 1);
  var twoDigitDate =
    currentDate.getDate() >= 10
      ? currentDate.getDate()
      : "0" + currentDate.getDate();
  var createdDateTo =
    currentDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;

  return createdDateTo;
}

function ModifiedOnDate() {
  var currentDate = new Date();
  var twoDigitMonth =
    currentDate.getMonth() + 1 >= 10
      ? currentDate.getMonth() + 1
      : "0" + (currentDate.getMonth() + 1);
  var twoDigitDate =
    currentDate.getDate() >= 10
      ? currentDate.getDate() + 1
      : "0" + currentDate.getDate();
  var createdDateTo =
    currentDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;

  return createdDateTo;
}

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
