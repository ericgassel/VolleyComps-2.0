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


 app.post("/newteam/:teamname", async (req, res) =>{
    const pyshell = util.promisify(PythonShell.run);
    const teamname = req.params.teamname
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

    const spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet

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
        const jsonObject = createJsonObject(headers, data, col);
        
        res.status(200).send(jsonObject);

    } catch(error){
        res.status(500).send(error);
    }
})



app.post("/write/:spreadsheetId/:sheet", express.json(), async (req, res) =>{

    const spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet
    var data = req.body.data

    if(sheet == "roster" || sheet == "rotations"){
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



 app.post("/delete/:spreadsheetId/:sheet", express.json(), async (req, res) =>{
    const spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet

    var delete_by_id = 0
    var targetValues = []
    if(req.query.player_id){
        targetValues = req.query.player_id.split(',');
        delete_by_id = 1
    }
    if(req.query.rotation_id){
        if(sheet != "rotations"){
            res.status(500).send("Specified a rotation_id, but are not calling a rotations page")
            return;
        }

        if(delete_by_id == 1){
            targetValues = targetValues.concat(req.query.rotation_id.split(','))
        }else{
            targetValues = req.query.rotation_id.split(',');
        }

        if(delete_by_id == 1){delete_by_id = 3;}else{delete_by_id = 2;}
        
    }

    try{
        const sheetInfo = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: sheet
        });


        if(delete_by_id != 0){

            const sheetMetadata = await googleSheets.spreadsheets.get({auth, spreadsheetId, fields: 'sheets(properties(sheetId,title))' });
            var sheetId = -1;
            for (const sheet_info of sheetMetadata.data.sheets) {
                if (sheet_info.properties.title == sheet) {
                    sheetId = sheet_info.properties.sheetId;
                }
            }

            const data = sheetInfo.data.values;
            
            var rowsToDelete = [];
            
            // Find the rows to delete
            if(delete_by_id == 1 && sheet == "rotations"){
                for (let i = 0; i < data.length; i++) {
                    if (targetValues.includes(data[i][1])) {
                        rowsToDelete.push(i + 1);
                    }
                }
            }
            else{
                for (let i = 0; i < data.length; i++) {
                    if (targetValues.includes(data[i][0])) {
                        rowsToDelete.push(i + 1);
                    }
                }
            }
            if(delete_by_id == 3){
                const specificRowsToDelete = []
                for (const row of rowsToDelete) {
                    if (targetValues.includes(data[row-1][1])) {
                        specificRowsToDelete.push(row);
                    }
                }
                rowsToDelete = specificRowsToDelete;
            }
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
                    console.log(error)
                    res.status(500).send(error)
                }
            }else{
                res.status(500).send("Specified ids do not exist")
                return
            }
        }

        
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


 function uniqueId(){
    return crypto.randomBytes(8).toString('hex');
 }

 function addUniqueId(data, sheet){
    var newData = []
    if(sheet == "rotations"){
        const id = uniqueId()
        for(let arr of data){
            arr.unshift(id)
            newData.push(arr)
        }
    }else{
        for(let arr of data){
            arr.unshift(uniqueId())
            newData.push(arr)
        }
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




function createSchoolsJson(arr) {
    return arr.reduce((acc, cur) => {
        acc[cur[0]] = cur[1];
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
