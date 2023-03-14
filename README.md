# VolleyComps-2.0

By: Eric Gassel, Joshua Song, Michael Dreger, Sam Gloss, Sam Rosenburg, Daniel Kim

# Frontend Documentation

## Home

## Teams

## Scouting Report

## Shot Entry
The Shot Entry page is where you can enter shots for different players to then be viewed in the scouting report. To add a shot, follow these steps:

1. Select a date using the date selector in the top right (Note: This may be below the court depending on the size of your computer monitor). You may select any date, but this field was intended to be the date of the game for which the shot comes from. By selecting a date, you will filter all the shots to only display shots that occur on that specific date.
2. Select a player under "Shot Info".
3. Select shot options. This includes whether the shot was a Serve or a regular Shot, and if the shot was a Kill/Ace, Returned, or Out.
4. Next, select the starting and end spots for the shot on the court.
5. Press "ADD SHOT".

After pressing "ADD SHOT", the shot should display on the court. You can delete the shot by selecting the shot on the court and then pressing delete.

At any time you may press "Reset" which resets all selected options and currently selected spots on the court.

Hovering over "ADD SHOT" and "Delete" will give small reminders on how to add and delete a shot.

You may navigate to the Scouting Report and Rotation Entry pages via the navagation on the left of the screen or the buttons on the bottom right.

## Rotation Entry
The Rotation Entry page is where you can add rotations for a team. 
> The areas mentioned for selecting different parts of a rotation and adding/editing them may appear below the drawing box or to the right depending on your computer monitor. In this documentation, the area will be referred to as being on the right on the screen.

Initially, if there are no rotations added, to the right you will see text that says "No Rotations Added" and a button that says "Add Rotation". By pressing "Add Rotation" you will be able to add any player that has been added to the rotation by selecting the player and then selecting the spot in the rotation where you wish to add the player. Note, each player in the rotation has to be unique (i.e no duplicate players in the rotation). If there are less than 6 players available, the page will ask you to add players to the team.

After adding 6 players to a rotation, you will be brought to the Rotation Entry page. Here, you may add more rotations at the top of the section on the right. Additionally, you may edit the selected rotation by pressing the "Edit Rotation" button.

If multiple rotations are added, you can switch between them by selecting the button displaying the each added rotation number at the top of the section on the right.

To add a route for a rotation, follow these steps.
1. Select a player from the 6 players that are a part of the rotation.
2. Draw the route for the player in the box on the left of the screen by holding down right click to draw in the box.
3. Press the "Add Route" button.

To delete a route for a rotation, follow these steps:
1. Select a player with a route already drawn in the drawing box.
2. Press the "Delete Route" button.

When adding notes in the sections below the drawing box or below the players in the current rotation on the right hand of the screen, make sure to press the corresponding save button.

You may navigate to the Scouting Report and Shot Entry pages via the navagation on the left of the screen or the buttons on the bottom right.

# Backend Documentation

## Data Storage
Data is stored in 429 (and counting) distinct google sheets. Each google sheet contains critical information that holds all our compiled data and team information
There are three key sheets to reference though: Schools, Schedule, and Dummy_school
Schools (https://docs.google.com/spreadsheets/d/1h1gG2-I7gka9li1u3U04zbM4AOtwauEa9AdnVhoyfss/edit#gid=530332686):
-Has 3 Main Catagories: 
--School Name, School Spread Sheet Id (i.e. redirect to Dummy_school), and school logo
Schedule (https://docs.google.com/spreadsheets/d/1s79U6G7kGcdViYJ51JzY-DG2DIR7fxEFPpq_XwbQCnI/edit#gid=0):
-Has 4 Main Catagories:
--College Name, Date of Game, Location of Game, and Game Result (if applicable)
Dummy_School (https://docs.google.com/spreadsheets/d/1D5DQnXIo3drLnXyzIxB9F4wPRgJIc1antzWAXFlCijM/edit#gid=158875928):
-This is a baseline sheet that is an example of the 427 differet schools we currently supports sheets. 
-This sheet has 5 different pages: \n
--Roster:
--- player_id, name, number, height, position, class, notes
--Spray-Chart:
---player_id, type, result, start_x, start_y, end_x, end_y, date
--Rotations:
---rotation_number, player_id, player_number, movement_colors, line, notes, blocking_scheme, serve_recieve, transition
--team_stats:
---Team Kills, Attack_Errors, Attempts, Percent, Kills_Per_Set, Set_Assists, Assists_Per_Set, Ball_Handling_Errors, Aces, Aces_Errors, Aces_Per_Set, Serve_Errors, Serve_Errors_Per_Set, Digs, Digs_Per_Set, Solo, Blocking_Assists, Blocking_Errors Blocks, Blocks_Per_Set
--ind_stats (individual statistics):
---Player_ID, Image, Season, Name, Number, Position(s), Height, Year, SP, MP, K, K/S, E, TA, PCT, A, A/S, SA, SA/S, SE, DIG, D/S, RE, BS, BA, TB, B/S, BE, BHE, PTS, PTS/S

## Scraping
The scrapig runs in two components. Volleyball Logos and VolleyScraperMain. Volleyball Logos is a once a year needed run. It gets the years list of teams, team logos, and school pages on the NCAA site. VolleyScraperMain is the meat of the scraping protocols and needs to be run daily during the Volleyball Season in order to give the most accurate and up to date information. 
VolleyScraperMain has a three of major functions:
  -Population of Carleton Schedule along with results
  -Creation of Every team in D3's spreadsheet with proper headers etc. 
  -Population of most teams rosters, individual statistics, and team statistics. 
All Data that is scraped is then stored on that individual teams spreadsheet which is on Google Sheets that the Scraper directly interacts with.


# How to start up the existing code

### Frontend
To start up the frontend of VolleyVision, first find the file in your command line interface.

At this point, on Mac, your terminal should look something like this:
(MacOS)
```sh
...[personal computer info] VolleyComps-2.0 %
```
or
(Windows)
```sh
...[personal computer info]/VolleyComps-2.0$
```

After reaching this point, run the following command in the terminal to get into the frontend folder:

```sh
cd frontend
```

Then, if this the first time completing these steps, install npm by running: 
```sh
npm install
```

Next, you should be able to start the project with:
```sh
npm start
```
If you get an error that says something along the lines of:
```sh
opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}
```
Run the following command in your terminal:
```sh
export NODE_OPTIONS=--openssl-legacy-provider
```
Then run the following command again:  
```sh
npm start
```

After following these steps, VolleyVision should open as a tab in your browser.

### Backend
