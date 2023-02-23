
import VolleyballScheduleScraper as schedule

def main():
    filePath = "/Users/samuelgloss/.config/gspread/volleyball-schedule-375303-954371a472e5.json"
    #sheetName = "Dummy_school"
    sheetName = "Schedule"
    pageName = "Schedule"
    URL = "https://athletics.carleton.edu/sports/womens-volleyball/schedule?path=wvball"
    schedule.run(filePath, sheetName, pageName, URL)
    


main()