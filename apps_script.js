/**
 * Mega Lottery Draw - Google Apps Script Backend (lotter_realtime)
 * 
 * INSTRUCTIONS TO DEPLOY:
 * 1. In Google Apps Script (Code.gs), replace everything with this code.
 * 2. Click "Save" (Ctrl+S / Cmd+S).
 * 3. Click "Run" -> select "setupSheet" to initialize the spreadsheet tabs & headers.
 * 4. Click "Deploy" (top right) -> "New deployment".
 * 5. Select type: "Web app".
 *    - Description: "Lottery Realtime API"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (VERY IMPORTANT: Select "Anyone")
 * 6. Click "Deploy", copy the Web App URL (ends in /exec), and paste it into admin.html!
 */

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup 'Config' Sheet
  let configSheet = ss.getSheetByName('Config');
  if (!configSheet) {
    configSheet = ss.insertSheet('Config');
  }
  configSheet.clear();
  
  // Headers & styling
  const configHeaders = [
    ['Key', 'Value', 'Description']
  ];
  configSheet.getRange('A1:C1').setValues(configHeaders)
    .setFontWeight('bold')
    .setBackground('#0f2759')
    .setFontColor('#00f2fe');
  
  const defaultData = [
    ['minToken', 1111, 'Minimum Token Number'],
    ['maxToken', 1360, 'Maximum Token Number'],
    ['prize1Winner', '', 'Forced Winning Token for 1º Prémio (Blank = Random)'],
    ['prize2Winner', '', 'Forced Winning Token for 2º Prémio (Blank = Random)'],
    ['prize3Winner', '', 'Forced Winning Token for 3º Prémio (Blank = Random)'],
    ['prize4Winner', '', 'Forced Winning Token for 4º GRANDE PRÉMIO (Blank = Random)'],
    ['remoteAction', 'NONE', 'Remote Stage Action: NONE, SPIN, NEXT, RESET'],
    ['lastUpdated', new Date().getTime(), 'Last Updated Epoch Milliseconds']
  ];
  
  configSheet.getRange(2, 1, defaultData.length, 3).setValues(defaultData);
  configSheet.autoResizeColumns(1, 3);
  
  // 2. Setup 'WinnersLog' Sheet
  let logSheet = ss.getSheetByName('WinnersLog');
  if (!logSheet) {
    logSheet = ss.insertSheet('WinnersLog');
  }
  if (logSheet.getLastRow() === 0) {
    const logHeaders = [['Timestamp', 'Round', 'Prize Name', 'Winner Token', 'Formatted Token']];
    logSheet.getRange('A1:E1').setValues(logHeaders)
      .setFontWeight('bold')
      .setBackground('#0f2759')
      .setFontColor('#ffd700');
    logSheet.autoResizeColumns(1, 5);
  }
  
  return { status: 'success', message: 'Sheet initialized successfully' };
}

function getConfigData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Config');
  if (!sheet || sheet.getLastRow() < 2) {
    setupSheet();
    sheet = ss.getSheetByName('Config');
  }
  
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const config = {};
  
  rows.forEach(r => {
    const key = String(r[0]).trim();
    const val = r[1];
    if (key) {
      config[key] = val;
    }
  });
  
  return {
    status: 'success',
    minToken: Number(config.minToken) || 1111,
    maxToken: Number(config.maxToken) || 1360,
    prize1Winner: config.prize1Winner !== '' && config.prize1Winner !== undefined ? String(config.prize1Winner).trim() : '',
    prize2Winner: config.prize2Winner !== '' && config.prize2Winner !== undefined ? String(config.prize2Winner).trim() : '',
    prize3Winner: config.prize3Winner !== '' && config.prize3Winner !== undefined ? String(config.prize3Winner).trim() : '',
    prize4Winner: config.prize4Winner !== '' && config.prize4Winner !== undefined ? String(config.prize4Winner).trim() : '',
    remoteAction: config.remoteAction || 'NONE',
    lastUpdated: Number(config.lastUpdated) || new Date().getTime()
  };
}

function doGet(e) {
  try {
    const data = getConfigData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Config');
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName('Config');
    }
    
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      payload = e.parameter;
    }
    
    // Check if this is a winner log action
    if (payload.action === 'LOG_WINNER') {
      let logSheet = ss.getSheetByName('WinnersLog');
      if (!logSheet) {
        setupSheet();
        logSheet = ss.getSheetByName('WinnersLog');
      }
      logSheet.appendRow([
        new Date().toLocaleString(),
        payload.round || '',
        payload.prizeName || '',
        payload.token || '',
        payload.formattedToken || ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', logged: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Update Config
    const now = new Date().getTime();
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    
    for (let i = 0; i < rows.length; i++) {
      const key = String(rows[i][0]).trim();
      const rowIdx = i + 2;
      
      if (payload.minToken !== undefined && key === 'minToken') {
        sheet.getRange(rowIdx, 2).setValue(Number(payload.minToken));
      }
      if (payload.maxToken !== undefined && key === 'maxToken') {
        sheet.getRange(rowIdx, 2).setValue(Number(payload.maxToken));
      }
      if (payload.prize1Winner !== undefined && key === 'prize1Winner') {
        sheet.getRange(rowIdx, 2).setValue(payload.prize1Winner === '' ? '' : String(payload.prize1Winner).trim());
      }
      if (payload.prize2Winner !== undefined && key === 'prize2Winner') {
        sheet.getRange(rowIdx, 2).setValue(payload.prize2Winner === '' ? '' : String(payload.prize2Winner).trim());
      }
      if (payload.prize3Winner !== undefined && key === 'prize3Winner') {
        sheet.getRange(rowIdx, 2).setValue(payload.prize3Winner === '' ? '' : String(payload.prize3Winner).trim());
      }
      if (payload.prize4Winner !== undefined && key === 'prize4Winner') {
        sheet.getRange(rowIdx, 2).setValue(payload.prize4Winner === '' ? '' : String(payload.prize4Winner).trim());
      }
      if (payload.remoteAction !== undefined && key === 'remoteAction') {
        sheet.getRange(rowIdx, 2).setValue(payload.remoteAction);
      }
      if (key === 'lastUpdated') {
        sheet.getRange(rowIdx, 2).setValue(now);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      updated: true,
      lastUpdated: now
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
