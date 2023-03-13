 const express = require("express");
 const {google} = require("googleapis");
 const url = require("url");
 const crypto = require("crypto");
 const fs = require("fs");
 const cors = require("cors");
 const util = require('util');
 const {PythonShell} = require('python-shell');

 const app = express();
 app.use(express.json());
 app.use(cors());

 const auth = new google.auth.GoogleAuth({
    keyFile: "src/api_credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
 })

 const client = auth.getClient();
 const googleSheets = google.sheets({version: "v4", auth: client});

 app.get("/", async (req, res) =>{
    res.status(200).send("API is running. Check out /help for help."); 
 })

 app.get("/help", async (req, res) =>{
    fs.readFile('src/README.md', 'utf8', (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.set('Content-Type', 'text/plain')
            res.send(data)
        }
    })
})


 app.post("/newteam", async (req, res) =>{
    const pyshell = util.promisify(PythonShell.run);
    if(!req.body.teamname){res.status(500).send("No team name provided. Send a JSON object with the team name assigned to the key `teamname`."); return;}
    const teamname = req.body.teamname
    var new_spreadsheetId = ""

    const options = {
        scriptPath: 'src',
        args: [teamname]
      };

    try{
        const results = await pyshell('create-spreadsheet.py', options);
        new_spreadsheetId = results[0];

        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId: "1h1gG2-I7gka9li1u3U04zbM4AOtwauEa9AdnVhoyfss",
            range: "schools",
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            resource: {
                values: [[teamname, new_spreadsheetId]]
            }
        })
        res.status(200).json({"spreadsheet_id": new_spreadsheetId})
    } catch(error){
        res.status(500).send(error);
    }
})




 app.get("/data/schools", async (req,res) =>{
    const spreadsheetId = "1h1gG2-I7gka9li1u3U04zbM4AOtwauEa9AdnVhoyfss"
    
    try{
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "schools"
        })

        const jsonObject = createSchoolsJson(getRows.data.values)
        
        res.status(200).json(jsonObject);

    } catch(error){
        res.status(500).send(error);
    }
})




 app.get("/data/:spreadsheetId/:sheet", async (req, res) =>{

    var spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet

    if(spreadsheetId == "carleton" || spreadsheetId == "Carleton"){
        spreadsheetId = "1mvABHHmHdPpfyBM3RXDKs5hU-XvAc6EV1mhrDc4T-rk";
        if(sheet != "schedule"){
            res.status(500).json({"error": "Did you mean to access the sheet 'schedule'?"});
            return;
        }
    }

    var col = []
    if(req.query.col){
        col = req.query.col.split(',');
    }

    try{
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: sheet
        })

        const data = getRows.data.values
        const headers = data.shift()
        var jsonObject = createJsonObject(headers, data, col);
        if(spreadsheetId == "1mvABHHmHdPpfyBM3RXDKs5hU-XvAc6EV1mhrDc4T-rk" && sheet == "schedule"){
            try{
                const getRows = await googleSheets.spreadsheets.values.get({
                    auth,
                    spreadsheetId: "1h1gG2-I7gka9li1u3U04zbM4AOtwauEa9AdnVhoyfss",
                    range: "schools"
                })
        
                const schools = createSchoolsJson(getRows.data.values)
                addIdToTeams(jsonObject, schools);
                
        
            } catch(error){
                res.status(500).send(error);
                return
            }
        }
        
        res.status(200).send(jsonObject);

    } catch(error){
        res.status(500).send(error);
    }
})



app.post("/write/:spreadsheetId/:sheet", express.json(), async (req, res) =>{

    const spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet
    var data = req.body.data

    if(!data){
        res.status(500).json({"error": "Invalid request body. Check that you are sending a json object with the key 'data', and that 'data' represents an array of arrays. See the readme for more details"})
    }

    if(sheet == "roster"){
        data = addUniqueId(data, sheet)
    }

    try{
        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: sheet,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            resource: {
                values: data
            }
        })
        res.status(200).json(data)
    } catch (error){
        res.status(500).json(error)
    }
 })

 app.post("/write/:spreadsheetId/:sheet/edit", express.json(), async (req, res) =>{

    const spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet
    if(!req.body.toedit){
        res.status(500).json({"error": "Specify which row(s) you would like to edit by including a `toedit` object in the request body. See readme for more"})
        return
    }
    const toedit = req.body.toedit
    if(!req.body.newvalue){
        res.status(500).json({"error": "Specify a new value"})
        return
    }
    if (!Array.isArray(req.body.newvalue)) {
        res.status(500).json({"error": "newvalue must be an array of objects"})
        return
    }
    const newvalues = req.body.newvalue


    try{
        const sheetInfo = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: sheet
        });

        const sheetMetadata = await googleSheets.spreadsheets.get({auth, spreadsheetId, fields: 'sheets(properties(sheetId,title))' });
        var sheetId = -1;
        for (const sheet_info of sheetMetadata.data.sheets) {
            if (sheet_info.properties.title == sheet) {
                sheetId = sheet_info.properties.sheetId;
            }
        }

        const data = sheetInfo.data.values;

        const requests = []

        for (const newvalue of newvalues){
            var valid = checkValidFilters(Object.keys(toedit), data[0])
            if(!valid[0]){
                res.status(500).json({"error": `Column '${valid[1]}' does not exist in worksheet '${sheet}'`})
                return;
            }
            valid = checkValidFilters([newvalue.var], data[0])
            if(!valid[0]){
                res.status(500).json({"error": `Column '${valid[1]}' does not exist in worksheet '${sheet}'`})
                return;
            }
            const headers = data[0]
            
            columnIndex = headers.indexOf(newvalue.var);
            if(columnIndex == -1){
                res.status(500).json({"error": `specified "var" is not a valid variable`})
                return
            }


            const rowsToEdit = findRowsToMatch(data, toedit)

            for (const rowIndex of rowsToEdit) {
                requests.push({
                updateCells: {
                    range: {
                        sheetId,
                        startRowIndex: rowIndex - 1,
                        endRowIndex: rowIndex,
                        startColumnIndex: columnIndex,
                        endColumnIndex: columnIndex + 1
                    },
                    rows: [{
                        values: [{
                            userEnteredValue: {
                                stringValue: newvalue.value
                            }
                            }]
                        }],
                    fields: "userEnteredValue"
                }
                });
            }
        }

        const response = await googleSheets.spreadsheets.batchUpdate({
            auth,
            spreadsheetId,
            resource: {requests}
        })

        res.status(200).send("success")

    }catch(error){
        res.status(500).send(error)
    }
 })



 app.post("/delete/:spreadsheetId/:sheet", express.json(), async (req, res) =>{
    const spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet
    var spec_delete = 0
    var todelete = {}
    if(req.body.todelete){
        todelete = req.body.todelete;
        spec_delete = 1;
    }

    try{
        const sheetInfo = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: sheet
        });

        // Delete by specififed columns
        if(spec_delete == 1){

            const sheetMetadata = await googleSheets.spreadsheets.get({auth, spreadsheetId, fields: 'sheets(properties(sheetId,title))' });
            var sheetId = -1;
            for (const sheet_info of sheetMetadata.data.sheets) {
                if (sheet_info.properties.title == sheet) {
                    sheetId = sheet_info.properties.sheetId;
                }
            }

            const data = sheetInfo.data.values;

            const valid = checkValidFilters(Object.keys(todelete), data[0])
            if(!valid[0]){
                res.status(500).json({"error": `Column '${valid[1]}' does not exist in worksheet '${sheet}'`})
                return;
            }
            
            const rowsToDelete = findRowsToMatch(data, todelete);
            
            if(req.query.recent){
                rowsToDelete = getLastNElements(rowsToDelete, parseInt(req.query.recent))
            }
            
            if (rowsToDelete.length > 0) {
            // Delete the rows
            const requests = [];
            
            var shift = 0
            for (const rowIndex of rowsToDelete) {
                requests.push({
                deleteDimension: {
                    range: {
                        sheetId,
                        dimension: "ROWS",
                        startIndex: rowIndex - 1 - shift,
                        endIndex: rowIndex - shift
                    }
                }
                });
                shift += 1;
            }
            
            try{
                await googleSheets.spreadsheets.batchUpdate({
                    auth,
                    spreadsheetId,
                    resource: {
                        requests
                    }
                });
                res.status(200).send("rows successfully deleted")
                return
            } catch(error){
                res.status(500).send(error)
            }
            }else{
                res.status(500).send("No rows to delete")
                return
            }
        }

        //no columns specified, clear the whole sheet
        
        const returnedRange = sheetInfo.data.range;
        const firstRow = returnedRange.split(":")[0];
        const newRange = `${firstRow.split("1")[0]}2:${returnedRange.split(":")[1]}`;
    
        await googleSheets.spreadsheets.values.clear({
            auth,
            spreadsheetId: spreadsheetId,
            range: newRange
        });

        res.status(200).send("successfully cleared")
    } catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})

function addIdToTeams(teamObjs, idObj) {
    for (let teamObj of teamObjs) {
      for (let [key, value] of Object.entries(idObj)) {
        if (matchStrings(teamObj["team"], key)) {
          teamObj["id"] = value[0];
          teamObj["logo"] = value[1];
          break;
        }
      }
    }
    return teamObjs;
  }

  function matchStrings(str1, str2) {
    // Remove any apostrophes and periods from both strings and convert to lowercase
    const cleanStr1 = str1.replace(/['.]/g, '').toLowerCase();
    const cleanStr2 = str2.replace(/['.]/g, '').toLowerCase();
  
    // Check if one string is a substring of the other
    if (cleanStr1.includes(cleanStr2) || cleanStr2.includes(cleanStr1)) {
      return true;
    }
  
    // Check if the strings are similar using the Levenshtein distance algorithm
    const maxDistance = 2; // Maximum allowed Levenshtein distance
    const distance = getLevenshteinDistance(cleanStr1, cleanStr2);
    return distance <= maxDistance;
  }
  
  // Helper function to calculate the Levenshtein distance between two strings
  function getLevenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from(Array(m+1), () => Array(n+1).fill(0));
  
    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= n; j++) {
        if (i === 0) {
          dp[i][j] = j;
        } else if (j === 0) {
          dp[i][j] = i;
        } else if (str1[i-1] === str2[j-1]) {
          dp[i][j] = dp[i-1][j-1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
      }
    }
  
    return dp[m][n];
  }
  
  


function findRowsToMatch(data, tomatch) {
    const headers = data[0];
    const headerIndices = {};

    headers.forEach((header, index) => {
      headerIndices[header] = index;
    });
    
    const result = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      var match = true;
      
      for (const key in tomatch) {
        const values = tomatch[key].split(',');
        if (!values.includes(row[headerIndices[key]])) {
          match = false;
          break;
        }
      }
      
      if (match) {
        result.push(i+1);
      }
    }
    
    return result;
  }
  

 function uniqueId(){
    return crypto.randomBytes(8).toString('hex');
 }

 function addUniqueId(data, sheet){
    var newData = []
    
    for(let arr of data){
        const id = uniqueId()
        arr.unshift(id)
        newData.push(arr)
    }
    return newData;
 }

 function createJsonObject(headers, data, col) {
    let indexes = []
    if(col && col.length > 0) {
        col.forEach(c => {
            let index = headers.indexOf(c)
            if(index !== -1)
            {
                indexes.push(index)
            }
        })
    }else{
        indexes = headers.map((_, i) => i)
    }
    return data.reduce((acc, cur) => {
        let obj = {}
        indexes.forEach((i) => obj[headers[i]] = cur[i])
        acc.push(obj)
        return acc
    }, [])
}

function checkValidFilters(keys, headers){
    var badkey = false
    keys.forEach(key => {
        if (!headers.includes(key)) {
            badkey = key;
        }
    });
    if(badkey){
        return [false, badkey]
    }
    return [true, null];
}


function createSchoolsJson(arr) {
    return arr.reduce((acc, cur) => {
        acc[cur[0]] = [cur[1], cur[2]];
        return acc;
    }, {});
}

function filterDataByColumns(data, col) {
    return data.filter(row => {
      return col.some(c => row.includes(c))
    });
  }

function getLastNElements(array, n) {
    if (n >= array.length) {
        return array;
    }
    return array.slice(array.length - n, array.length);
}
  
  
  
  


 // const writeRouter = require("./routes/write");

 // app.use("/write", writeRouter)

 app.listen(5000, (req, res) => console.log("running on 5000"));
