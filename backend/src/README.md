# Backend API Documentation

The API currently connects to port 5000 on our server and can be accessed at 
`http://cs400volleyball.mathcs.carleton.edu:5000`.

You must be connected to eduroam or the Carleton VPN to access this API. 

## Running the API locally

To run the API on your local machine, navigate to `VolleyComps-2.0/backend` and run the command `npm run start`. 

Please note that connecting to the Google Sheets API will fail if you are running the API locally and connected to eduroam, as there are Carleton firewalls set up preventing this.

You do *not* need to run this part to access the api already running on the server. This is just to run locally.

## Accessing the API server
Follow these steps: 
1. Make sure you're connected to eduroam or the Carleton VPN.
2. Enter our VM from the command line: `ssh username@cs400volleyball.mathcs.carleton.edu`
3. Move to home directory `cd ..`
4. Move into the API server directory `cd backend`
5. The server is currently running in the background without a machine needing to be on. Attach to it sing tmux `tmux attach`
6. To terminate the API program, press `ctrl-c` or `command-c` for mac
7. To run the program again, type `npm run start`
8. To exit tmux and leave the API server running, press `ctrl-b` (or `command-b`), then press `d` quickly after. 
9. You should see the message `[detached (from session 0)]`. The server is running.

You may need to adjust some commands for mac.

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
    - columns in rotations: [rotation_id, player_id, line, additional, notes, blocking_scheme, serve_recieve, transition]
- "stats"
    - not defined yet. waiting on what info will be provided from sam g

## Notes for interacting with the API

- Use dummy school "spreadsheetId: 1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM" for testing.
- "spreadsheetId" is how you will tell the API which team you want to post data to. There is a unique spreadsheet id for each Google Sheet that is found in its URL.
- "sheet" is how you will specify which sheet you want to post data to. There are only five valid sheets, and they can be found in the "Sheet Design" section.

## Implemented Endpoints

### GET /  (root)

Health check route. Access the root to see if the API is up and running. 

### GET /help
Loads this file.

### POST /newteam/:teamname

This endpoint creates a new team spread sheet with the title as the name passed in the path, and returns the spreadsheet id in the following JSON format:

```
{
    "spreadsheet_id": "id"
}
```

Please note that this function is slow and may take ~10 seconds to complete.

### GET /data/schools

This endpoint returns one JSON object where the keys are the school names, and the values are the corresponding spreadsheet ids in the database (as shown below).

```
{
    "Dummy_school": "1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM",
    "Harvard": "F4wPRgJIc1antzWAXFlCijM1D5DQnXIo3drLnXyzIxB9",
    "Yale": "PRgJIc1aIo3drLnXyzIxB9ntzWAXFlCijM1D5DQnXF4w"
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

### POST /delete/:spreadsheetId/:sheet

Calling this endpoint with no specified ids clears the content of a specified sheet (page) in a team's spreadsheet except for the first row (column headers). I forsee this being useful in updating stats page.

*IMPORANT*: This operation cannot be undone. The data is gone once deleted. Use carefully.

#### Specifying specific rows to delete

In order to specify a specific row to delete, you must pass along the player_id (and/or rotation_id) of the row of data you want to delete as a query.

For example, if you wanted to delete information about a player from the Dummy School with a player_id `4a0607485855e088` from the sheet `roster`, you would call:
`POST /delete/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster?player_id=4a0607485855e088`

You can request to remove info about multiple players at once by adding additional ids separate by commas:
`POST /delete/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/roster?player_id=4a0607485855e088,8756f4fc30e954ec`

##### Deleting from the rotations page

There are two ways you can delete data from the rotations page: by `player_id` and `rotation_id`. You can delete by one of these, or *BOTH* of these. Here is an example of deleting by both of these:
`POST delete/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/rotations?player_id=5,6&rotation_id=f4c1f6fb561f4d72`

*Read the following carefully:* when specifying both parameters, only rows of data that match a provided rotation id *AND* a provided player id will be deleted. Both must match for a row to be deleted. For example, given the above API call:

Will be deleted:
- [f4c1f6fb561f4d72,	5,	[arrays3],	notes!!,	block this way,	[serverecieve data,this is words],	[my additional notes on this, more notes]]
- [f4c1f6fb561f4d72,	6,	[arrays4],	these are notes!!,	scheming,	[serverecieve data, this is recieving],	[my additional notes on this, important info]]

Will not be deleted:
- [9cb0cbced5cb0d91,	5,	[arrays4],	these are notes!!,	scheming,	[serverecieve data, this is recieving],	[my additional notes on this, important info]]
- [f4c1f6fb561f4d72,	7,	[arrays4],	these are notes!!,	scheming,	[serverecieve data, this is recieving],	[my additional notes on this, important info]]

#### Deleting by most recent

If you don't want to delete all instances of a given player in a sheet, you can specify how many you want by most recent additions. For example, this would be useful in deleting the most recent addition to the spray chart by a specified player instead of deleting all of that player's shots.

You can do this by adding the query `recent`, so if you want to delete the most recent addition, you can call:
`POST delete/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/spray_chart?player_id=4f1162f40d063c5d&recent=1`
    
---------------------------------------------------------------------------
To be implemented:
- edit a column of a row (change a player's number, edit the notes, etc)
- deleting a row given an id
- filter by date
- stats sheet populated
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