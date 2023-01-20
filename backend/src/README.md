# Backend API Documentation

The API currently connects to port 5000 on our server and can be accessed at 
`http://cs400volleyball.mathcs.carleton.edu:5000`.

You must be connected to eduroam or the Carleton VPN to access this API. 

## Running the API locally

To run the API on your local machine, navigate to `VolleyComps-2.0/backend` and run the command `npm run start`.

Please note that connecting to the Google Sheets API will fail if you are running the API locally and connected to eduroam, as there are Carleton firewalls set up preventing this.

## Sheet Design

The data base is composed of separate Google Sheets files that each represent one team. For example, there will be a Google Sheets titled "St. Olaf", and another Google Sheets titled "Macalaster".

Each Google Sheets contain the following five sheets "pages":

- "roster"
    - columns in roster: [player_id, name, number, height, position, class, notes]
- "schedule"
    - columns in schedule: [team, date, home, location, outcome]
- "spray_chart"
    - columns in spray_chart: [player_id, type, result, start_x, start_y, end_x, end_y, date]
- "rotations"
    - columns in rotations: [player_id, rotation_id, a, b, c, date]
- "stats"
    - not defined yet. waiting on what info will be provided from sam g

## Notes for interacting with the API

- Use dummy school "spreadsheetId: 1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM" for testing.
- "spreadsheetId" is how you will tell the API which team you want to post data to. There is a unique spreadsheet id for each Google Sheet that is found in its URL.
- "sheet" is how you will specify which sheet you want to post data to. There are only five valid sheets, and they can be found in the "Sheet Design" section.

## Implemented Endpoints

### GET /help
Loads this file.

### POST /newteam/:teamname

This endpoint creates a new team spread sheet with the title as the name passed in the path, and returns the spreadsheet id in the following JSON format:

```
{
    "spreadsheet_id": [
        "id"
    ]
}
```

Please note that this function is slow and may take ~10 seconds to complete.

### GET /data/:spreadsheetId/:sheet

When calling this endpoint, you must enter the spreadsheet id and sheet you want to access in the path.

For example: `GET data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster`

This endpoint sends a HTTP 200 OK when data is successfully returned, and returns a JSON object of data from the requested team and sheet in the following format:

```
[
    {
        "var1": "data1",
        "var2": "data2",
                ...
    },
    {
        "var1": "data3",
        "var2": "data4",
        ...
    },
    ...
] 
``` 

where each resource inside of curly brackets {} contains data from one row, labeled by variable. For example,
the example API call "GET data/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster" could return:

```
[
    {
        "player_id": "fd20c61a555fd0e6",
        "name": "Esther Example",
        "number": "12",
        "height": "6'2",
        "position": "OPP",
        "class": "So"
    },
    {
        "player_id": "3e8926e37d187359",
        "name": "Goofy Goober",
        "number": "60",
        "height": "3'11",
        "position": "QB",
        "class": "Sr",
        "notes": "Hits really hard!"
    },
    {
        "player_id": "12cbb76b774db5cd",
        "name": "Fairy Fake",
        "number": "34",
        "height": "5'7",
        "position": "MB",
        "class": "Sr",
        "notes": "is kind of cool /n runs out of bounds for no reason"
    }
]
```

#### Requesting a column (variable)

If you are only interested in one column (variable) of data in a sheet, you can request data from a specific column by adding a query to the end of the endpoint as follows: 
`GET /data/:spreadsheetId/:sheet?col=variable`
    
For example, say you want just the list of player numbers from Dummy School, then you would call
`GET /data/:spreadsheetId/:sheet?col=number`

and that would return an array as follows:

```
[
    "1",
    "12",
    "60",
    "34"
]
```

notes:
- for the "?col=" query, it is currently implemented such that it only returns that one column, and you cannot request mulitple columns. also, I understand it will be useful to have ids returned with the data. That is not currently implemented, but will be coming soon. 

- for the "?col=" query, the variable you request must match the variable name in the database exactly. Variables can be found in the Database Design section.
    


### POST /write/:spreadsheetId/:sheet

#### Calling the endpoint:

When calling this endpoint, you must enter enter the spreadsheet id and sheet you want to access in the path.
ex: `POST write/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster`
    
To pass the data you want to write through, you must send a json object in the body of the call in the following format:
```
{
    "data": [
        [row data],
        [row 2 data],
        [row 3 data],
        ...
    ]
}
```
        
EXAMPLE:

if you wanted to add two new players to Dummy School, you would call 
`"POST write/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster"`
and pass along the following in the body:

```
{
    "data": [
        ["Goofy Goober"	"60", "5'11", "OPP", "Sr", "Hits really hard!"],
        ["Sally Sample", "34", "5'7" "OH", "Jr", "great passer, looks to score off of set /n bad returner"]
    ]
}
```
    
#### Return Object:
This endpoint returns a HTTP 200 OK when data is successfully imported. The response object will be the  same as the array in the data variable that was sent, except it will include the unique ids. In other words, you will recieve back exactly what was uploaded to the database.

For example, the response object for the example call made above would be:

```
    [
        ["3e8926e37d187359", "Goofy Goober"	"60", "5'11", "OPP"	"Sr", "Hits really hard!"],
        ["025429f22a36965e", "Sally Sample", "34", "5'7" "OH", "Jr", "great passer, looks to score off of set /n bad returner"]
    ]
```

notes: 
- you can send multiple rows of data in one call

- when sending data to a sheet, you must send data in the same order of the variables in the columns outlined in the Sheet Design section. For example, when posting to "spray_chart", you must send the following data in this exact order: [type, result, start_x, start_y, end_x, end_y, date]

- the backend will generate unique ids for players, shots, and rotations
    
---------------------------------------------------------------------------
To be implemented:
- an endpoint that returns a json object containing each team name and their spreadsheet ids
- edit a column of a row (change a player's number, edit the notes, etc)
- deleting a row given an id
- deleting the contents of a page
- filter by date
- stats sheet populated
- can return multiple columns by request, along with the relavent unique ids
---------------------------------------------------------------------------

PLEASE NOTE, there are usage limits for the google sheets API (how frequently it can be used). Here is a quick overview:

Read requests:
- Per day per project:	Unlimited
- Per minute per project:	300
- Per minute per user per project:	60

Write requests:
- Per day per project:	Unlimited
- Per minute per project:	300
- Per minute per user per project:	60
    
more information about this can be found here: `https://developers.google.com/sheets/api/limits`