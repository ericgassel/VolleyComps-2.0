from bs4 import BeautifulSoup as BS
import requests
from csv import writer
import csv
import gspread
import time
import re

filePath =  "/Users/samuelgloss/.config/gspread/volleyball-schedule-375303-954371a472e5.json"
##update this later with github path.


def main():
  sa = gspread.service_account(filename = filePath)
  sh = sa.open("Schedule")
  worksheet = sh.worksheet("Logos")
  URL = "https://www.ncaa.com/stats/volleyball-women/d3/current/team/48"
  baseURL = "https://www.ncaa.com/"
  names = []
  try: 
      page = requests.get(URL)
      names = request(URL,page, worksheet, 0)
      for i in range(2,10):
            holdPG = URL + "/p" + str(i)
            page = requests.get(holdPG)
            names = names + (request(holdPG,page, worksheet, (i - 1)*50))
            print(names)
      i = 2
      for name in names:
        try:
            print(name) 
            newPage = requests.get(name)
            pageLink(name, newPage, worksheet, i)
        except Exception as e: 
            print(e)
            continue
        i += 1
        time.sleep(1)   
             
            
  except Exception as e: 
            print(e)
            pass


def pageLink(URL, page, worksheet, i):
  soup = BS(page.content, "html.parser")
  info = soup.find_all(("span", {"class" : "info"}))
  inf = soup.find(("h1", {"class", "school-name"}))
  info_hold = []
  for ina in info:
      if '.' in ina.get_text():
          info_hold.append(ina.get_text())
  worksheet.update('C' + str(i) + ':D' + str(i), [[str("https://" + info_hold[1]), inf.get_text()]])
           
def request(URL, page, worksheet, i):
  soup = BS(page.content, "html.parser")
  tables = soup.find_all("table")
  spot = i * 50 + 2
  hasRun = False
  schoo = []
  logo = []
  names = []
  
  for table in tables:
     for tr in table.find_all('tr'):
         if(hasRun):
             worksheet.update('A' + str(i+2) + ':A' + str(spot) , schoo)
             worksheet.update('B' + str(i+2) + ':B' + str(spot) , logo)
             #worksheet.update('C' + str(i+2) + ':C' + str(spot) , names)
             return names
         for td in table.find_all('td'):
             try:
              for img in td.find_all('img'):
                  logo.append([img['src']])
              for name in td.find_all('a', {"class": "school"}):
                  schoo.append([name.get_text()])
                  name_hold = str("https://www.ncaa.com" + name['href'])
                  names.append(name_hold)
                  spot += 1
                  hasRun = True
             except:
                 print("break")
                 time.sleep(30)
                 continue


    


main()