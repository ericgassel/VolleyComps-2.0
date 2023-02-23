from bs4 import BeautifulSoup as BS
import requests
from csv import writer
import csv
import gspread
import time
import re

def run(filePath, sheetName, pageName, URL):
  sa = gspread.service_account(filename = filePath)
  sh = sa.open_by_key(sheetName)
  worksheet = sh.worksheet(pageName)
  #URL = "https://athletics.carleton.edu/sports/womens-volleyball/schedule?path=wvball"
  try: 
            page = requests.get(URL)
            request(URL,page, worksheet)
  except Exception as e: 
            print(e)
            print("fail")
            pass


def request(URL, page, worksheet):
  soup = BS(page.content, "html.parser")
  schools = soup.find_all("div", {"class": "sidearm-schedule-game-opponent-name"})
  dates = soup.find_all("div", {"class": "sidearm-schedule-game-opponent-date flex-item-1"})
  results = soup.find_all("div", {"class": "sidearm-schedule-game-result text-italic"})
  locations = soup.find_all("div", {"class": "sidearm-schedule-game-location"})
  
  count = len(schools)
  holder = []
  holdee = []
  for i in range(count):
    spot = str(2 + i)
    schoo = schools[i].get_text()
    schoo = re.sub("\n","",schoo)
    date  = dates[i].get_text()
    location = locations[i].get_text()
    location = re.sub("\n","",location)
    holder.append([schoo,date, location])

    try:
        holdee.append([results[i].get_text()])


    except:
        holdee.append([])
        pass #no result yet posted

  worksheet.update('A' + str(2) + ':C' + str(count + 2), holder)
  worksheet.update('D' + str(2) + ':D' + str(count + 2), holdee)



    


