exports.InitializeData = function initialize(processInd) {
  var lastupdateDate = Ti.App.Properties.getString("lastUpdatedOn");
  var APIHost = Ti.App.Properties.getString("APIHost");
  APIHost = "http://sum-dev.apphb.com/api";
  Ti.App.Properties.setString("APIHost", APIHost);

  var connectString;
  var db;
  try {
    db = Titanium.Database.install("/db/myturnerdb.db", "myturnerdb");

    if (lastupdateDate === null) {
      var sql = "select LastUpdatedOn from UpdateStatus";
      var row = db.execute(sql);

      if (row.isValidRow()) {
        lastupdateDate = row.fieldByName("LastUpdatedOn");
        Ti.App.Properties.setString("lastUpdatedOn", lastupdateDate);
        Ti.API.info("lastupdated on :" + lastupdateDate);
      }
    }

    connectString =
      APIHost +
      "/Person?$filter=ModifiedDateTime gt datetime'" +
      lastupdateDate +
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
      //alert(e.error);
      //Ti.API.error("ERROR " + e.error);
      Ti.App.fireEvent("app:loadMain");
    };

    xhr.onload = function () {
      var json_data = JSON.parse(xhr.responseText).value;
      Ti.API.info("Success " + json_data.length);
      //open db
      // Ti.API.info(getCurrentDate());
      //db.file.setRemoteBackup(false);
      if (db != null) {
        for (var i = 0; i < json_data.length; i++) {
          if (processInd) {
            processInd.message = json_data.length - i + " remaining..";
          }

          InsertUpdateRow(json_data[i], db);
        }

        if (processInd) {
          processInd.message = "Init DB Complete..";
        }
        //db.open();
        //db.execute("BEGIN TRANSACTION");
        try {
          db.execute(
            "update UpdateStatus set LastUpdatedOn='" + ModifiedOnDate() + "'"
          );
        } catch (err) {
          Ti.API.info("Error Updating data ");
        }

        //db.execute("COMMIT");
        //db.close();
        Ti.API.info("db updated :" + ModifiedOnDate());
        Ti.App.Properties.setString("lastUpdatedOn", ModifiedOnDate());
        Ti.App.fireEvent("app:loadMain");
      } else {
        //alert('db is null');
      }
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
    Ti.App.fireEvent("app:loadMain");
  }

  //db.close();
};
