exports.GetAllEmployees = function getEmployeesByFilter(
  division,
  location,
  value
) {
  try {
    // Ti.API.info('Get Employee by Filter');

    var rows;
    var hasAndClause;
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      var sql =
        "select PersonId,FirstName,LastName,PrimaryEmailAddress,MobilePhone,WorkPhone from Person";

      hasAndClause =
        division != "" &&
        division.toLowerCase().substr(0, 3) != "all" &&
        location != "" &&
        location.toLowerCase().substr(0, 3) != "all";

      if (
        (division.toLowerCase().substr(0, 3) != "all" && division != "") ||
        (location.toLowerCase().substr(0, 3) != "all" && location != "")
      ) {
        sql += " where ";
      }

      if (division != "" && division.toLowerCase().substr(0, 3) != "all") {
        sql += " lower(Division)='" + division.toLowerCase() + "'";
      }

      if (hasAndClause) {
        sql += " and ";
      }

      if (location != "" && location.toLowerCase().substr(0, 3) != "all") {
        sql += " lower(city)='" + location.toLowerCase() + "'";
      }

      if (value != null && value != "" && value != "undefined") {
        sql +=
          " and  (lower(firstname) like '%" +
          value.toLowerCase() +
          "%' or lower(lastname) like '%" +
          value.toLowerCase() +
          "%') ";
      }

      sql += " order by lower(LastName) ";

      Ti.API.info("sql:" + sql);
      rows = db.execute(sql);
    }
  } catch (err) {
    Ti.API.error("error filter :" + err.message);
    return null;
  }

  return rows;
};
