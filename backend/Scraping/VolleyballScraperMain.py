
import VolleyballScheduleScaper as schedule
import VolleyballStats as team
import VolleyballPlayerInfo as ind 
import VolleyballGetSheet as get
import VolleyballAddTeamSheet as add
import time
from datetime import date
from dateutil.relativedelta import relativedelta

def main():
    #this is the main for the whole scraper
    filePath = "/Users/samuelgloss/.config/gspread/volleyball-schedule-375303-954371a472e5.json"
    #sheetName = "Dummy_school"
    URL = "https://athletics.carleton.edu/sports/womens-volleyball/schedule?path=wvball"

    #updates/runs schedule for carleton
    schedule.run(filePath, "1mvABHHmHdPpfyBM3RXDKs5hU-XvAc6EV1mhrDc4T-rk", "schedule", URL)
    
    #all schools we have a DB on.
    listSchools = get.run(filePath, "1h1gG2-I7gka9li1u3U04zbM4AOtwauEa9AdnVhoyfss", "schools")  
    #links for each schools website data
    listLinks = get.run(filePath, "1s79U6G7kGcdViYJ51JzY-DG2DIR7fxEFPpq_XwbQCnI", "Logos")  
    lengthSchools = len(listSchools) + 1
    #season starts in august so we start getting current year on August 1. 
    year = date.today() - relativedelta(months=7) 
    year = year.year
    for link in listLinks:
        try:
          if any(link[3] in sublist for sublist in listSchools):
            for iD in listSchools:
                if(link[3] == iD[0]):
                    ids = iD[1]
                    break
          else:
            ids = add.run(filePath, link[3]) 
            lengthSchools += 1
            get.addSchoolRow(filePath, "1h1gG2-I7gka9li1u3U04zbM4AOtwauEa9AdnVhoyfss", "schools", link[3], ids, link[1], lengthSchools)
            time.sleep(10)
          lnk = get.updateRedirect(link[2])
          team.run(filePath, ids, 'team_stats', lnk, link[3], year)
          ind.run(filePath, ids, 'roster', 'ind_data', lnk, year)
          print(lnk)
          time.sleep(10)
        except:
            continue

    #get.updateRedirect(URL)


    


main()
