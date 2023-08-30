exports.setUserDivision = function SetUserDivision(email) {
  // Ti.API.info('set default division');

  try {
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      var sql =
        "select Division from Person where lower(PrimaryEmailAddress)='" +
        email.toLowerCase() +
        "'";
      // Ti.API.info('sql:' + sql);
      var row = db.execute(sql);

      if (row.isValidRow() && row.fieldByName("Division") != null) {
        Ti.App.Properties.setString(
          "DefaultDivision",
          row.fieldByName("Division")
        );
      }

      // Ti.API.info('default filter :'+ row.fieldByName('Division'));
    }

    db.close();
    db = null;
  } catch (err) {
    Ti.API.error("error filter :");
  }
};

exports.GetEmployeeDetail = function getEmployeeDetail(personid) {
  // Ti.API.info('getEmployeeDetail');

  try {
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      var sql = "select * from Person where personid='" + personid + "'";
      // Ti.API.info('sql:' + sql);
      var row = db.execute(sql);

      if (row.isValidRow() && row.fieldByName("PersonId") != null) {
        return row;
      }
    }
  } catch (err) {
    Ti.API.error("error filter :" + err.message);
  }
};
