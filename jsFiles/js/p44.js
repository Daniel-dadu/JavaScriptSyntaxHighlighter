function InsertUpdateResource(dataRow, db) {
  try {
    if (db != null) {
      var sql =
        "select count(*) count  from Resource where ResourceId='" +
        dataRow.ResourceID +
        "'";
      var rows = db.execute(sql);
      //alert(parseInt(rows.fieldByName("count")));

      if (parseInt(rows.fieldByName("count")) > 0) {
        db.execute("BEGIN IMMEDIATE TRANSACTION");
        var deleteSql =
          "delete from Resource where ResourceId='" + dataRow.ResourceID + "'";
        // Ti.API.info('delete :' + deleteSql);
        db.execute(deleteSql);
        db.execute("COMMIT TRANSACTION");
      }
      //insert

      var insertsql =
        "insert into Resource(ResourceId, Division, Name, PhoneNumber, LocationName, OfficeMailStop)";
      insertsql += " values (";
      insertsql +=
        " '" +
        dataRow.ResourceID +
        "','" +
        replaceSpecialChars(dataRow.ListDivision) +
        "','" +
        replaceSpecialChars(dataRow.Name) +
        "','" +
        replaceSpecialChars(dataRow.PhoneNumber) +
        "','" +
        dataRow.LocationName +
        "','" +
        replaceSpecialChars(dataRow.OfficeMailStop) +
        "'";
      insertsql += ")";
      // Ti.API.info('insertsql :' + insertsql);
      db.execute(insertsql);
    }
  } catch (err) {
    //alert(err);
    Ti.API.error("Error:" + err);
  }
}

function InsertUpdateRow(dataRow, db) {
  try {
    if (db != null) {
      var sql =
        "select count(*) count  from person where PersonId='" +
        dataRow.PersonID +
        "'";
      var rows = db.execute(sql);
      //alert(parseInt(rows.fieldByName("count")));

      if (parseInt(rows.fieldByName("count")) > 0) {
        db.execute("BEGIN IMMEDIATE TRANSACTION");
        var deleteSql =
          "delete from Person where PersonId='" + dataRow.PersonID + "'";
        // Ti.API.info('delete :' + deleteSql);
        db.execute(deleteSql);
        db.execute("COMMIT TRANSACTION");
      }
      //insert

      var insertsql =
        "insert into Person (PersonId, PeopleSoftPersonID, PeopleSoftManagerID, UserName, BirthDate, PrimaryEmailAddress, City, ";
      insertsql +=
        " FirstName, MiddleName, LastName, DepartmentSetID, DepartmentNumber, Department, OfficeMailStop, Building, JobTitle, WorkPhone, ";
      insertsql +=
        " MobilePhone, FaxPhone, Skype, IM, Twitter, Active, CreatedDateTime, ModifiedDateTime, Division, ProfileImageURL)";
      insertsql += " values (";
      insertsql +=
        " '" +
        dataRow.PersonID +
        "','" +
        replaceSpecialChars(dataRow.PeopleSoftPersonID) +
        "','" +
        replaceSpecialChars(dataRow.PeopleSoftManagerID) +
        "','" +
        replaceSpecialChars(dataRow.UserName) +
        "','" +
        dataRow.BirthDate +
        "','" +
        replaceSpecialChars(dataRow.PrimaryEmailAddress) +
        "','" +
        replaceSpecialChars(dataRow.City) +
        "',";
      insertsql +=
        " '" +
        replaceSpecialChars(dataRow.FirstName) +
        "','" +
        replaceSpecialChars(dataRow.MiddleName) +
        "','" +
        replaceSpecialChars(dataRow.LastName) +
        "','" +
        replaceSpecialChars(dataRow.DepartmentSetID) +
        "','" +
        replaceSpecialChars(dataRow.DepartmentNumber) +
        "','" +
        replaceSpecialChars(dataRow.Department) +
        "','" +
        replaceSpecialChars(dataRow.OfficeMailStop) +
        "','" +
        replaceSpecialChars(dataRow.Building) +
        "','" +
        replaceSpecialChars(dataRow.JobTitle) +
        "','" +
        replaceSpecialChars(dataRow.WorkPhone) +
        "',";
      insertsql +=
        " '" +
        replaceSpecialChars(dataRow.MobilePhone) +
        "','" +
        replaceSpecialChars(dataRow.FaxPhone) +
        "','" +
        replaceSpecialChars(dataRow.Skype) +
        "','" +
        replaceSpecialChars(dataRow.IM) +
        "','" +
        replaceSpecialChars(dataRow.Twitter) +
        "','" +
        dataRow.isActive +
        "','" +
        dataRow.CreatedDateTime +
        "','" +
        dataRow.ModifiedDateTime +
        "','" +
        replaceSpecialChars(dataRow.Division) +
        "','" +
        replaceSpecialChars(dataRow.ProfileImageURL) +
        "'";
      insertsql += ")";
      Ti.API.info("insertsql :" + insertsql);
      db.execute(insertsql);
    }
  } catch (err) {
    //alert(err);
    Ti.API.erroro("Error:" + err);
  }
}
