from bs4 import BeautifulSoup as BS
import requests
from csv import writer
import csv
import gspread
import time
import re

def run(filePath, teamName):
    sa = gspread.service_account(filename = filePath)
    sh = sa.create(teamName)
    ids = sh.id
    sh = sa.open_by_key(ids)
    worksheet = sh.worksheet("Sheet1")
    worksheet.update_title("roster")
    sh.add_worksheet(title="spray_chart", rows = 1000, cols = 1000)
    sh.add_worksheet(title="rotations", rows = 1000, cols = 1000)
    sh.add_worksheet(title="team_stats", rows = 1000, cols = 1000)
    sh.add_worksheet(title="ind_data", rows = 1000, cols = 1000)

    sh = sa.open_by_key(ids).worksheet("roster")
    sh.append_rows([["player_id", "name", "number", "height", "position", "class", "notes"]])

    sh = sa.open_by_key(ids).worksheet("spray_chart")
    sh.append_rows([["player_id", "type", "result", "start_x", "start_y", "end_x", "end_y", "date"]])

    sh = sa.open_by_key(ids).worksheet("rotations")
    sh.append_rows([["rotation_number", "player_id", "player_number", "movement_colors", "line", "notes", "blocking_scheme", "serve_recieve", "transition"]])

    sh = sa.open_by_key(ids).worksheet("ind_data")
    sh.append_rows([["Player_ID", "Image", "Season", "Name", "Number", "Position(s)", "Height", "Year", "SP", "MP", "K", "K/S", "E", "TA", "PCT", "A", "A/S", "SA", "SA/S", "SE", "DIG", "D/S", "RE", "BS", "BA", "TB", "B/S", "BE", "BHE", "PTS", "PTS/S"]])

    sh = sa.open_by_key(ids)
    #sh.share('sgloss@volleyball-schedule-375303.iam.gserviceaccount.com', perm_type='user', role='writer')
    sh.share('volleycomps2-0@tutorial-370118.iam.gserviceaccount.com', perm_type='user', role='writer', notify = False) 
    sh.share('glosss@carleton.edu', perm_type='user', role='writer', notify = False)
    sh.share('gassele@carleton.edu', perm_type='user', role='writer',  notify = False)

    return sh.id
