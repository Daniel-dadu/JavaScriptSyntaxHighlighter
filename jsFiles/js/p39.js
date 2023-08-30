exports.GetAllDivisions = function selectAllDivisions(currentDivision) {
  // Ti.API.info('getting all divisions');
  var divisions = [];
  try {
    //divisions.push('All Divisions');
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      var sql =
        "select distinct division from Person where division <> ' ' and division != 'null' order by 1";
      // Ti.API.info('sql:' + sql);
      var row = db.execute(sql);

      while (row.isValidRow()) {
        divisions.push(row.fieldByName("division"));
        // Ti.API.info('Division :' + row.fieldByName('division'));
        row.next();
      }
    }
  } catch (err) {
    divisions.push(currentDivision);
  }

  db.close();
  db = null;

  return divisions;
};
