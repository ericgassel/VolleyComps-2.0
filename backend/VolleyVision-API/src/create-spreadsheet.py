import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
import argparse

# Connect to Google Sheets
scope = ['https://www.googleapis.com/auth/spreadsheets',
         "https://www.googleapis.com/auth/drive"]

credentials = ServiceAccountCredentials.from_json_keyfile_name("src/api_credentials.json", scope)
client = gspread.authorize(credentials)

# parse the arguments
parser = argparse.ArgumentParser()
parser.add_argument("arg1", help="first argument")
args = parser.parse_args()

team_name = args.arg1


#create new sheets
sheet = client.create(team_name)
sheet = client.open(team_name)

worksheet = sheet.worksheet("Sheet1")
worksheet.update_title("roster")
# sheet.add_worksheet(title="schedule", rows = 1000, cols = 1000)
sheet.add_worksheet(title="spray_chart", rows = 1000, cols = 1000)
sheet.add_worksheet(title="rotations", rows = 1000, cols = 1000)
sheet.add_worksheet(title="team_stats", rows = 1000, cols = 1000)
sheet.add_worksheet(title="ind_data", rows = 1000, cols = 1000)

sheet = client.open(team_name).worksheet("roster")
sheet.append_rows([["player_id", "name", "number", "height", "position", "class", "notes"]])

# sheet = client.open(team_name).worksheet("schedule")
# sheet.append_rows([["team", "date", "location", "outcome"]])

sheet = client.open(team_name).worksheet("spray_chart")
sheet.append_rows([["player_id", "type", "result", "start_x", "start_y", "end_x", "end_y", "date"]])

sheet = client.open(team_name).worksheet("rotations")
sheet.append_rows([["rotation_number", "player_id", "player_number", "movement_colors", "line", "notes", "blocking_scheme", "serve_recieve", "transition"]])

sheet = client.open(team_name).worksheet("ind_data")
sheet.append_rows([["Player_ID", "Image", "Season", "Name", "Number", "Position(s)", "Height", "Year", "SP", "MP", "K", "K/S", "E", "TA", "PCT", "A", "A/S", "SA", "SA/S", "SE", "DIG", "D/S", "RE", "BS", "BA", "TB", "B/S", "BE", "BHE", "PTS", "PTS/S"]])

sheet = client.open(team_name)
sheet.share('sgloss@volleyball-schedule-375303.iam.gserviceaccount.com', perm_type='user', role='writer')
sheet.share('gassele@carleton.edu', perm_type='user', role='writer')



spreadsheet_id = sheet.id
print(sheet.id)