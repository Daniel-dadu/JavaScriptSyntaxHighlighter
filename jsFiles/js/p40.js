exports.GetAllResources = function selectAllResources() {
  var rows;
  // Ti.API.info('getting all resources');

  try {
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      var sql =
        "select * from Resource where Name !=' ' and Name != 'null' order by Name";
      // Ti.API.info('sql:' + sql);
      var rows = db.execute(sql);
    }
  } catch (err) {
    Ti.API.error(err);
  }

  return rows;
};

exports.GetResource = function selectResource(id) {
  var row;
  // Ti.API.info('getting resource');

  try {
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      var sql = "select * from Resource where ResourceID='" + id + "'";
      // Ti.API.info('sql:' + sql);
      var row = db.execute(sql);
    }
  } catch (err) {
    Ti.API.error(err);
  }

  return row;
};

exports.GetAllLocations = function selectAllLocations(currentLocation) {
  var locations = [];
  // Ti.API.info('getting all locations');

  try {
    //locations.push('All Locations');
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (db != null) {
      var sql =
        "select distinct City from Person where City != '' and City != 'null' order by 1";
      // Ti.API.info('sql:' + sql);
      var row = db.execute(sql);

      while (row.isValidRow()) {
        var _city = row.fieldByName("City").toProperCase();
        if (locations.indexOf(_city) == -1) locations.push(_city);

        row.next();
      }
    }
  } catch (err) {}

  db.close();
  db = null;

  return locations;
};
