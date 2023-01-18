"""
install these if you have not already
pip install gspread
pip install oauth2client
pip install pandas
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd

# Connect to Google Sheets
scope = ['https://www.googleapis.com/auth/spreadsheets',
         "https://www.googleapis.com/auth/drive"]

credentials = ServiceAccountCredentials.from_json_keyfile_name("api_credentials.json", scope)
client = gspread.authorize(credentials)

#create new sheets
sheet = client.create("test_sheet2")

sheet.share('gassele@carleton.edu', perm_type='user', role='writer')