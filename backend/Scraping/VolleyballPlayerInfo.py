from bs4 import BeautifulSoup as BS
import requests
from csv import writer
import csv
import gspread
import re
import time
import json



def run(filePath, sheetName, pageName, pageNameTwo, URL, year):
  #access point for service account
  sa = gspread.service_account(filename = filePath)
  sh = sa.open_by_key(sheetName)
  #we have two sheets for player info because of database structure so we open both to satisfy these conditions
  worksheet = sh.worksheet(pageName)#roster
  statssheet = sh.worksheet(pageNameTwo)#ind_data
  #standard path to the team stats
  url = URL + "/sports/womens-volleyball/roster?path=wvball"
  try: 
            page = requests.get(url)
            #player roster info
            request(url,page, worksheet, statssheet)
            #player ids on ncaa site
            requestIDs(url, page, worksheet, statssheet)
            #player stat inpoitns
            (ids,links) = createLinks(worksheet)
            print(ids)
            i = 2
            holder = []
            for link in links:
                try:
                    newURL = URL + "/sports/womens-volleyball/roster/" + link
                    newPage = requests.get(newURL)
                    if str(newPage.status_code) == str(200):
                        holder.append([addPlayers(newURL, newPage, worksheet, url, i)])
                        i += 1
                    else:
                        #moves back two if the page doesn't load
                        ids.pop(i - 2)
                except Exception as e: 
                    print(e)
                    continue
            #adds the player pictures
            statssheet.update('B' + str(2) + ':B' + str(i), holder)
            i = 2
            stats_hold = []
            for id in ids:
                #antibot detection averted here.
                newURL = URL + "/services/responsive-roster-bio.ashx?type=career-stats&rp_id=" + str(id) + "&path=volleyball"
                newPage = requests.get(newURL, headers={"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"})
                if str(newPage.status_code) == str(200):
                    stats_hold.append(addStats(newURL, newPage, worksheet, i, year, statssheet))
                    i += 1
            #adds the individual stats of all players
            statssheet.update('I' + str(2) + ":AE" + str(i), stats_hold)
                 
  except Exception as e: 
            print(e)
            print("fail")
            pass

def requestIDs(URL, page, worksheet, statssheet):
    soup = BS(page.content, "html.parser")
    ids = soup.find_all("li", {"class": "sidearm-roster-player"})
    j = 0
    links = []
    for id in ids:
        try:
            #worksheet.update('A' + t, id['data-player-id'])
            links.append([id['data-player-id']])
        except:
            print("l")
            continue
        j += 1
    
    worksheet.update('A' + str(2) + ':A' + str(2 + j), links)
    statssheet.update('A' + str(2) + ':A' + str(2 + j), links)

def request(URL, page, worksheet, statssheet):
  #accesses web page
  soup = BS(page.content, "html.parser")
  #scrapes these named field from that page using these catagories
  names = soup.find_all("div", {"class": "sidearm-roster-player-name"})
  numbers = soup.find_all("span", {"class": "sidearm-roster-player-jersey-number"})
  positions = soup.find_all("span", {"class": "text-bold"})
  heights = soup.find_all("span", {"class": "sidearm-roster-player-height"})
  years = soup.find_all("span", {"class": "sidearm-roster-player-academic-year"})
  
  count = len(names)
  holder = []
  for i in range(count):
    time.sleep(2)
    spot = str(2 + i)
    #converts names into form that they can be viewed fine by the front end
    name = re.sub('\n', '', names[i].get_text())
    name = re.sub('\t', '', name)
    name = re.sub('\r', '', name)
    name = re.sub("[^a-zA-Z/]", "", name)
    name = re.sub(r"(\w)([A-Z])", r"\1 \2", name)
    #adds it to the holder
    holder.append([name, re.sub("[^0-9]", "", numbers[i].get_text()), re.sub("[^a-zA-Z/]", "", positions[i].get_text()), heights[i].get_text(), years[i*2].get_text()])
  
  #batch updated so we don't exceed update limits
  worksheet.update('B' + str(2) + ':F' + str(count+2), holder)
  statssheet.update('D' + str(2) + ':H' + str(count+2), holder)

def addPlayers(URL, page, worksheet, domain, index):
  #gets player pictures if coach would like to view in the reports
  soup = BS(page.content, "html.parser")
  picture = soup.find("div", {"class": "sidearm-roster-player-image"})
  holder = []
  for img in picture.find_all('img'):
            return str(domain + img['src'])

def addStats(URL, page, worksheet, index, year, statssheet):
    #takes each of the named catagory for the NCAA ind stats catagory
    try:
        data = page.text
        statssheet.update('C' + str(index), year)
        parse_json = json.loads(data)
        parser = parse_json[str(year)]
        holder = []
        holder.append(parser['sp'])
        holder.append(parser['mp'])

        stats = parser['season_stats']

        o_stats = stats['offensive_stats']

        holder.append(o_stats['kills'])
        holder.append(o_stats['kills_per_set'])
        holder.append(o_stats['errors'])
        holder.append(o_stats['total_attempts'])
        holder.append(o_stats['hitting_percentage'])
        holder.append(o_stats['assists'])
        holder.append(o_stats['assists_per_set'])
        holder.append(o_stats['service_aces'])
        holder.append(o_stats['service_aces_per_set'])
        holder.append(o_stats['service_errors'])
        
        d_stats = stats['defensive_stats']       
        
        holder.append(d_stats['dig'])
        holder.append(d_stats['digs_per_set'])
        holder.append(d_stats['receiving_erros'])
        holder.append(d_stats['solo_blocks'])
        holder.append(d_stats['assist_blocks'])
        holder.append(d_stats['total_blocks'])
        holder.append(d_stats['total_blocks_per_set'])
        holder.append(d_stats['blocking_error'])
        holder.append(d_stats['ball_handling_error'])
        holder.append(d_stats['pts'])
        holder.append(d_stats['pts_per_set'])
        return holder
    except Exception as e: 
                    print(e)
                    return []
        
def createLinks(worksheet):
    ids = []
    links = []
    #starts 1 past headers.
    spot = 2
    try:
        while(worksheet.get('B'+ str(spot)) != ''):
            #gets the player IDs and player names scraped earlier. converts them to proper form to access the NCAA site for their stats
            strn = worksheet.get('A'+ str(spot) + ':B'+ str(spot))
            str1 = strn[0][1]
            str1 = re.sub("\\s+","-",str1)
            str2 = strn[0][0]
            links.append(str1 + '/' + str2)
            ids.append(str2)
            spot += 1
            #1 second per access because 60 second 60 call limit
            time.sleep(1)
    except:
        return (ids,links)
    return (ids,links)

