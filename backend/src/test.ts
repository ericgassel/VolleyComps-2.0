
async function getRosterData() {
    const spreadsheetId = "1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM";
    const baseUrl = "cs400volleyball.mathcs.carleton.edu:5000";
    
    const data = [
        ["Goofy Goober", "60", "5'11", "OPP", "Sr", "Hits really hard!"],
        ["Sally Sample", "34", "5'7", "OH", "Jr", "great passer, looks to score off of set /n bad returner"]
    ];
    
    const endpoint = `${baseUrl}/write/${spreadsheetId}/roster`;
    
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
    };
    
    fetch(endpoint, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
    
}

getRosterData();


