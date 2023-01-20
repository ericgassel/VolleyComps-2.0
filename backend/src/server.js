 const express = require("express");
 const {google} = require("googleapis");
 const url = require("url");
 const crypto = require("crypto");
 const fs = require("fs");
 const cors = require("cors");
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
    res.status(200).send("Hello there. check out /help for help."); 
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
    const teamname = req.params.teamname
    var spreadsheetId = ""

    const options = {
        scriptPath: 'src',
        args: [teamname]
      };

    PythonShell.run('create-spreadsheet.py', options, function (err, results) {
        if (err) throw err;
        res.status(200).json({"spreadsheet_id": results})
    });
 })

 app.get("/data/:spreadsheetId/:sheet", async (req, res) =>{

    const spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet
    var col = ""
    if(req.query.col){
        col = req.query.col
    }

    try{
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: sheet
        })

        const data = getRows.data.values
        const headers = data.shift()
    
        if(col != ""){
            const columnIndex = headers.indexOf(col)
            const colData = (data.map(row => row[columnIndex]))
    
            res.status(200).json(colData);
            return;
        }
    
        const jsonObject = createJsonObject(headers, data);
        
        res.status(200).send(jsonObject);

    } catch(error){
        res.status(500).send(error);
    }
})



app.post("/write/:spreadsheetId/:sheet", express.json(), async (req, res) =>{

    const spreadsheetId = req.params.spreadsheetId
    const sheet = req.params.sheet
    var data = req.body.data

    if(sheet === "roster" || sheet === "spray_chart"){
        data = addUniqueId(data, 1)
        console.log(data)
    }
    if(sheet === "rotations"){
        data = addUniqueId(data, 2)
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

 function uniqueId(){
    return crypto.randomBytes(8).toString('hex');
 }

 function addUniqueId(data, num){
    var newData = []
    for(let arr of data){
        if(num == 1){
            arr.unshift(uniqueId())
            newData.push(arr)
        }
        if(num == 2){
            arr.unshift(uniqueId(), uniqueId())
            newData.push(arr)
        }
    }
    return newData;
 }

 function createJsonObject(headers, data) {
    var jsonData = [];
    for (let d of data) {
        var obj = {};
        for (let i = 0; i < headers.length; i++) {
            obj[headers[i]] = d[i];
        }
        jsonData.push(obj);
    }
    return JSON.stringify(jsonData);
}

 // const writeRouter = require("./routes/write");

 // app.use("/write", writeRouter)

 app.listen(5000, (req, res) => console.log("running on 5000"));
