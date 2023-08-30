exports.checkUserName = function validateUserName(email) {
  // Ti.API.info('Validate User Email');

  try {
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      var sql =
        "select count(*) count from Person where lower(PrimaryEmailAddress)='" +
        email.toLowerCase() +
        "' and Active='true'";
      // Ti.API.info('sql:' + sql);
      var row = db.execute(sql);

      if (row.isValidRow() && parseInt(row.fieldByName("count")) > 0) {
        db.close();
        db = null;
        return true;
      }
    }
  } catch (err) {
    Ti.API.error("error filter :" + err.message);
  }

  db.close();
  db = null;
  return false;
};

exports.SearchEmployees = function SearchAllEmployees(value) {
  // Ti.API.info('Search Employees');

  try {
    var rows;

    var sql =
      "select PersonId,FirstName,LastName,PrimaryEmailAddress,MobilePhone,WorkPhone from Person where lower(firstname) like '%" +
      value.toLowerCase() +
      "%' or lower(lastname) like '%" +
      value.toLowerCase() +
      "%' order by lower(lastname)";

    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      // Ti.API.info('sql:' + sql);
      rows = db.execute(sql);
    }
  } catch (err) {}

  return rows;
};
