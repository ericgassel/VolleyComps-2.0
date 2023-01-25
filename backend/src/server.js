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
            range: "stats"
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
    console.log(req.query.col)

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
    
        // if(req.query.col){
        //     let colData = col.map((curr) => {
        //         const columnIndex = headers.indexOf(curr)
        //         if(columnIndex !== -1){
        //             return data.map(row => row[columnIndex])
        //         }
        //     })
    
        //     res.status(200).json(colData);
        //     return;
        // }
    
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
  


 // const writeRouter = require("./routes/write");

 // app.use("/write", writeRouter)

 app.listen(5000, (req, res) => console.log("running on 5000"));
