# VolleyVision API Documentation

You need a Google service acount to successfuly use this API. This the bottom of this documentation for more details.

## Accessing the API

The API currently connects to port 5000 on our VM and can be accessed at 
`http://cs400volleyball.mathcs.carleton.edu:5000`.

You must be connected to eduroam or the Carleton VPN to access this API. 

### Run the API locally

To run the API on your local machine, navigate to `VolleyComps-2.0/backend` and run the command `npm run start`. 

*Please note that there are certain Wifi's, such as Carleton's eduroam, that contain certain firewalls that prevent my API from establishing a connection to the Google Sheets API, and thus the API won't work. This may be the case for you if your API calls are timing out.

## Sheet Design

The data base is composed of separate Google Sheets files that each represent one team. For example, there will be a Google Sheets titled "St. Olaf", and another Google Sheets titled "Macalaster".

Each Google Sheets contain the following four sheets "pages":

- "roster"
    - columns in roster: [player_id, name, number, height, position, class, notes]
- "spray_chart"
    - columns in spray_chart: [player_id, type, result, start_x, start_y, end_x, end_y, date]
- "rotations"
    - columns in rotations: [rotation_number, line, notes, blocking_scheme, serve_recieve, transition]
- "team_stats"
    - [Team, Kills,	Errors,	Attempts, Percent,	Kills_Per_Set,	Assists, Assists_Per_Set, Ball_Handling_Errors, Aces, Errors, Aces_Per_Set, Errors, Errors_Per_Set, Digs, Digs_Per_Set, Solo, Assists, Errors, Blocks, Blocks_Per_Set]
- "ind_stats"
    -[Player_ID, Image, Season, Name, Number, Position(s), Height, Year, SP, MP, K, K/S, E, TA, PCT, A, A/S, SA, SA/S, SE, DIG, D/S, RE, BS, BA, TB, B/S, BE, BHE, PTS, PTS/S]

Carleton's schedule sheet looks like this:
- "schedule"
    - columns in schedule: [team, date, location, outcome]

## Notes for interacting with the API

- Use dummy school "spreadsheetId: 1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM" for testing.
- "spreadsheetId" is how you will tell the API which team you want to post data to. There is a unique spreadsheet id for each Google Sheet that is found in its URL.
- "sheet" is how you will specify which worksheet you want to post data to. There are only five valid sheets, and they can be found in the "Sheet Design" section.

## Implemented Endpoints

### GET /  (root)

Health check route. Access the root to see if the API is up and running. 

### GET /help
Loads this file.

### POST /newteam

This endpoint creates a new team spread sheet with the title as the name passed in body of a json object. The following is the required format for passing along the team name:

```
{
    "teamname": "St. Team Name University"
}
```

This endpoint returns the spreadsheet id in the following JSON format:

```
{
    "spreadsheet_id": "id"
}
```

Please note that this function is slow and may take ~10 seconds to complete. This endpoint also updates the "schools" spreadsheet.

### GET /data/schools

This endpoint returns one JSON object where the keys are the school names, and the values are arrays containing the corresponding spreadsheet ids in the database and logos (as shown below). The spreadsheet id is position 0, and the logo is position 2.

```
{
    "Dummy_school": [
        "1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM", 
        "https://www.ncaa.com/sites/default/files/images/logos/schools/bgl/carleton.svg"
    ],
    "Crown College": [
        "1ozhIeSb3M9TWoreLKBQpsR9UurZUoU6mComA47FlVr4",
        "https://www.ncaa.com/sites/default/files/images/logos/schools/bgl/crown-mn.svg"
    ],
    "University of Wisconsin-Platteville": [
        "1n-j1edLbh4a8Zb-aucbEhSlIWqQ46vDLH54QAmkWuTY",
        "https://www.ncaa.com/sites/default/files/images/logos/schools/bgl/wis-platteville.svg"
    ]
}
```

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

#### Accessing Carleton's schedule

To access Carleton's schedule, call the following: `GET /data/carleton/schedule`. If a school from the schedule exists in our database, it's spreadsheet ID will be returned with the key "id".

Example:
```
[
    {
        "team": "Crown College",
        "date": "\nSep 2 (Fri)\n5:00 PM \n",
        "location": "St. Paul, MN / Leonard Center",
        "outcome": "\n\nW,\n3-0\n\n",
        "id": "1ozhIeSb3M9TWoreLKBQpsR9UurZUoU6mComA47FlVr4",
        "logo": "https://www.ncaa.com/sites/default/files/images/logos/schools/bgl/crown-mn.svg"
    },
    {
        "team": "University of Wisconsin-Platteville",
        "date": "\nSep 3 (Sat)\n12:00 PM \n",
        "location": "St. Paul, MN / Leonard Center",
        "outcome": "\n\nL,\n1-3\n\n",
        "id": "1n-j1edLbh4a8Zb-aucbEhSlIWqQ46vDLH54QAmkWuTY",
        "logo": "https://www.ncaa.com/sites/default/files/images/logos/schools/bgl/wis-platteville.svg"
    }
]
```

#### Requesting by columns (variables)

If you are only interested in certain columns (variables) in a sheet, you can request data from a sheet by columns by adding a query to the end of the endpoint as follows: 
`GET /data/:spreadsheetId/:sheet?col=var1,var2,var3`
    
For example, say you want just the list of player names and their positions from Dummy School, then you would call
`GET /data/:spreadsheetId/:sheet?col=name,position`

and that would return a JSON object as follows:

```
[
    {
        "name": "Sally Sample",
        "position": "OH"
    },
    {
        "name": "Esther Example",
        "position": "OPP"
    },
    {
        "name": "Fairy Fake",
        "position": "DS"
    },
    {
        "name": "Goofy Goober",
        "position": "MB"
    }
]
```

notes:
- if requesting multiple variables, separate them by commas
- for the "?col=" query, the variables you request must match the variable name in the database exactly. Variables can be found in the Database Design section.
    


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
        ["Goofy Goober", "60", "5'11", "OPP", "Sr", "Hits really hard!"],
        ["Sally Sample", "34", "5'7", "OH", "Jr", "great passer, looks to score off of set /n bad returner"]
    ]
}
```
    
#### Return Object:
This endpoint returns a HTTP 200 OK when data is successfully imported. The response object will be the  same as the array in the data variable that was sent, except it will include the unique ids. In other words, you will recieve back exactly what was uploaded to the database.

For example, the response object for the example call made above would be:

```
    [
        ["3e8926e37d187359", "Goofy Goober", "60", "5'11", "OPP", "Sr", "Hits really hard!"],
        ["025429f22a36965e", "Sally Sample", "34", "5'7" "OH", "Jr", "great passer, looks to score off of set /n bad returner"]
    ]
```

notes: 
- you can send multiple rows of data in one call

- when sending data to a sheet, you must send data in the same order of the variables in the columns outlined in the Sheet Design section. For example, when posting to "spray_chart", you must send the following data in this exact order: [type, result, start_x, start_y, end_x, end_y, date]

### POST /write/:spreadsheetId/:sheet/edit

This endpoint allows you to edit single cell values by specifying which rows you want to edit, the column(s) to make changes to, and the value to upload.

Please follow the following format, where the row filtering is in "toedit", and the column(s) to edit and values are provided in the array "newvalue".

"var" is the column you want to edit, and "value" is the actual value you want to upload.

```
{
    "toedit":{
        "player_id": "1856"
    },
    "newvalue":[
        {
            "var": "notes",
            "value": "here is my new note for this player!"
        },
        {
            "var": "number",
            "value": "23"
        }
    ]
}
```

notes:
- "newvalue" should be an array even if you're making edits to one column
- values will be edited in every row that matches the filtering provided in "toedit". Be careful that you're not making changes to rows that you don't want to change
- you will get a 400 error with the message "Must specify at least one request." if no rows match the filters provided

### POST /delete/:spreadsheetId/:sheet

Calling this endpoint with no specified ids clears the content of a specified sheet (page) in a team's spreadsheet except for the first row (column headers). I forsee this being useful in updating stats page.

*IMPORANT*: This operation cannot be undone. The data is gone once deleted. Use carefully.

#### Specifying specific rows to delete

In order to specify a specific row to delete, you must pass along a json object "todelete" which contains the rows you'd like to delete by matching variable values

For example, if you wanted to delete information about a player from the Dummy School with a player_id `1845` from the sheet `roster`, you would pass along the following:

```
{
    "todelete":{
        "player_id": "1845"
    }
}
```

You can request to remove info about multiple players at once by adding additional ids separate by commas:

```
{
    "todelete":{
        "player_id": "1845,1847"
    }
}
```

You can specify more filters by adding more variables. Any row with at least one value in each of the provided values will be deleted.

```
{
    "todelete":{
        "player_id": "1845,1847",
        "number": "8"
    }
}
```
Based on the above, any row that's deleted must have a player_id of either "1845" or "1847" AND have the number "8".

#### Deleting by most recent

If you don't want to delete all instances of the given filters in a sheet, you can specify how many you want by most recent additions. For example, this would be useful in deleting the most recent addition to the spray chart by a specified player instead of deleting all of that player's shots.

You can do this by adding the query `recent`, so if you want to delete the most recent addition, you can call:
`POST delete/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/spray_chart?player_id=4f1162f40d063c5d&recent=1`
    
---------------------------------------------------------------------------

## Google Sheets API info

You must have a google service account with the google sheets API enabled to use this API. Learn more here: `https://cloud.google.com/iam/docs/service-accounts-create`.

Create a service account key that allows you to authenticate yourself for the google sheets API, and put the json key in the `api_credentials.json` file.

PLEASE NOTE, there are usage limits for the Google Sheets API (how frequently it can be used). Here is a quick overview:

Read requests:
- Per day per project:	Unlimited
- Per minute per project:	300
- Per minute per user per project:	60

Write requests:
- Per day per project:	Unlimited
- Per minute per project:	300
- Per minute per user per project:	60
    
more information about this can be found here: `https://developers.google.com/sheets/api/limits`