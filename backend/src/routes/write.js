const express = require("express");
const {google} = require("googleapis");

const router = express();
router.use(express.json());



router.post("/write", express.json(), async (req, res) =>{
    //write row(s) to spreadsheet
    console.log(req.body.test);

    const test = req.body.test;
    const why = req.body.why;

    try{
        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Sheet1!A:B",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    ["test", test],
                    ["why", why]
                ]
            }
        })
    } catch (error){
        console.error(error)
    }

    res.status(200).json({message: "Data successfully imported"})

 })


 module.exports = router