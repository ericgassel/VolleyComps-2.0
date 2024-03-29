from bs4 import BeautifulSoup as BS
import requests
from csv import writer
import csv
import gspread
import time
import re


def run(filePath, sheetName, pageName, URL, teamName, year):
  #service account access point
  sa = gspread.service_account(filename = filePath)
  #opens sheet
  sh = sa.open_by_key(sheetName)
  worksheet = sh.worksheet(pageName) #"team_stats"
  #end point with the data we want
  URL = URL + "/sports/wvball/stats/" + str(year)
  try: 
            page = requests.get(URL)
            request(URL,page, worksheet, teamName)
  except Exception as e: 
            print(e)
            print("fail")
            pass

def request(URL, page, worksheet, teamName):
  #specialized way front end guys want the headers to be labelled/ordered for the team stats
  errors = ['', 'Blocking_','Serve_','Serve_','Aces_','','Attack_']
  assists = ['', 'Blocking_','','Set_']
  soup = BS(page.content, "html.parser")
  tables = soup.find_all("table", {"class" : "sidearm-table"})
  spot = 2
  spotO = 2
  turn = True
  hasRun = False
  #column titles
  rowA = ["Team"]
  rowB = [teamName]
  rowC = ["Opponents"]
  for table in tables:
     for tr in table.find_all('tr'):
         if(hasRun):
           #updates the sheets
            worksheet.update('A' + str(1) + ':U' + str(1), [rowA])
            worksheet.update('A' + str(2) + ':U' + str(2), [rowB])
            worksheet.update('A' + str(3) + ':U' + str(3), [rowC])
            return 0
         for td in table.find_all('td'):
             try:
              #finding the data we want on the page using these specifications
              for img in td.select('span'):
                  text = img.get_text()
                  text = re.sub(r" ", '_', text)
                  if('Error' in text):
                    text = errors.pop() + text
                  if('Assist' in text):
                    text = assists.pop() + text
                  rowA.append(text)
                  spot += 1
                  break

             except:
                 print("break")
                 time.sleep(30)
                 continue
         for td in table.find_all('td', {"class": "text-right"}):
                  #flips because it contains data duplicates
                  if (turn):
                        rowB.append(td.get_text())
                        turn = False
                  else:
                        rowC.append(td.get_text())
                        turn = True
                  hasRun = True
  
  

