// ===== GET: Lấy danh sách posts =====
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Posts");
  if (!sheet) return _json({ success: false, error: "Sheet 'Posts' not found" });

  const data = sheet.getDataRange().getValues();
  const headers = data[0] || [];
  const rows = data.slice(1).map(r => {
    let obj = {};
    headers.forEach((h, i) => { obj[h] = r[i]; });
    return obj;
  });

  return _json({ success: true, data: rows });
}
// ===== POST: Create / Update / Delete =====
// Accepts either application/x-www-form-urlencoded (e.parameter)
// or application/json (e.postData.contents)
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Posts");
    if (!sheet) return _json({ success: false, error: "Sheet 'Posts' not found" });

    // Support both JSON body and form-urlencoded
    let params = null;
    if (e && e.postData && e.postData.contents && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      // JSON
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        return _json({ success: false, error: "Invalid JSON format" });
      }
    } else if (e && e.parameter) {
      // form-urlencoded
      params = e.parameter;
    } else {
      return _json({ success: false, error: "Missing post data" });
    }

    const action = params.action;
    if (!action) return _json({ success: false, error: "Missing action" });

    const data = sheet.getDataRange().getValues();

    // CREATE
    if (action === "create") {
      const newId = new Date().getTime();
      const newRow = [
        newId,
        params.title || "",
        params.content || "",
        new Date().toISOString()
      ];
      sheet.appendRow(newRow);
      return _json({ success: true, id: newId });
    }

    // UPDATE
    if (action === "update") {
      const id = params.id;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) == String(id)) {
          if (params.title !== undefined) sheet.getRange(i + 1, 2).setValue(params.title);
          if (params.content !== undefined) sheet.getRange(i + 1, 3).setValue(params.content);
          sheet.getRange(i + 1, 4).setValue(new Date().toISOString());
          return _json({ success: true });
        }
      }
      return _json({ success: false, error: "ID not found" });
    }

    // DELETE
    if (action === "delete") {
      const id = params.id;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) == String(id)) {
          sheet.deleteRow(i + 1);
          return _json({ success: true });
        }
      }
      return _json({ success: false, error: "ID not found" });
    }

    return _json({ success: false, error: "Unknown action" });
  } catch (err) {
    return _json({ success: false, error: err.message });
  }
}

// ===== HELPER: trả JSON (không set header) =====
function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
