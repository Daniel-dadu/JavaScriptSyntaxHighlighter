exports.InitializeResourceData = function initializeResource() {
  var lastResourceUpdatedOn = Ti.App.Properties.getString(
    "lastResourceUpdatedOn"
  );
  var APIHost = Ti.App.Properties.getString("APIHost");
  APIHost = "http://sum-dev.apphb.com/api";
  Ti.App.Properties.setString("APIHost", APIHost);

  var connectString;

  try {
    var db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (lastResourceUpdatedOn === null) {
      var sql = "select LastResourceUpdatedOn from UpdateStatus";
      var row = db.execute(sql);

      if (row.isValidRow()) {
        lastResourceUpdatedOn = row.fieldByName("LastResourceUpdatedOn");
        Ti.App.Properties.setString(
          "LastResourceUpdatedOn",
          lastResourceUpdatedOn
        );
        // Ti.API.info('LastResourceUpdatedOn on :' + lastResourceUpdatedOn);
      }
    }
    connectString =
      APIHost +
      "/Resource?$filter=ListDivision eq 'Sports' and ModifiedDateTime gt datetime'" +
      lastResourceUpdatedOn +
      "'";

    var xhr = Titanium.Network.createHTTPClient({
      timeout: 20000,
    });

    Ti.API.info(connectString);
    xhr.open("GET", connectString);
    // set Content-Type
    xhr.setRequestHeader("Content-Encoding", "gzip");
    xhr.setRequestHeader("accept", "application/json");

    xhr.onerror = function (e) {
      Ti.API.error("ERROR " + e.error);
      //Ti.App.fireEvent('app:loadMain');
    };

    xhr.onload = function () {
      var json_data = JSON.parse(xhr.responseText).value;
      // Ti.API.info("Success " + json_data.length);
      //open db
      // Ti.API.info(getCurrentDate());
      //db.file.setRemoteBackup(false);
      if (db != null) {
        for (var i = 0; i < json_data.length; i++) {
          InsertUpdateResource(json_data[i], db);
        }
        // Ti.API.info(getCurrentDate());
        Ti.App.Properties.setString("LastResourceUpdatedOn", ModifiedOnDate());
      }
      db.close();
    };

    xhr.onreadystatechange = function (aEvt) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          // Titanium.API.debug("status 200 ");
        }
      }
    };

    xhr.send({});
  } catch (err) {
    //alert(err);
  }

  //db.close();
};
