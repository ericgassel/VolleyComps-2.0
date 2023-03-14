from bs4 import BeautifulSoup as BS
import requests
from csv import writer
import csv
import gspread
import time
import re

#utility class used to minimize repeated code accross classes
def run(filePath, sheetName, pageName):
  #access point for service account
  sa = gspread.service_account(filename = filePath)
  #opens the sheet
  sh = sa.open_by_key(sheetName)
  worksheet = sh.worksheet(pageName)
  #gets sheet values
  lst = worksheet.get_all_values()
  #removes headers
  lst.pop(0) 
  return lst

def addSchoolRow(filePath, sheetName, pageName, teamName, ids, logo, row):
    sa = gspread.service_account(filename = filePath)
    sh = sa.open_by_key(sheetName)
    worksheet = sh.worksheet(pageName)
    #adds the school row when a new team is made.
    worksheet.update('A' + str(row) + ':C' + str(row), [[teamName, ids, logo]])

def updateRedirect(link):
    #takes a link. returns either link or the redirect
    try:
        response = requests.get(link)
        #follows the redirects til we get somewhere (hopefully)
        if response.history:
            for resp in response.history:
                link = response.url
    except:
        pass #incase too many redirects in which case we quit
    #most pages bring to aspx pages. we get rid of those
    link = link.replace('/index.aspx','')
    #get rid of index pages as well. but only if landing
    link = link.replace('/landing/index', '')
    #all pop ups have a splash id. so we get rid of those then no school links have numbers so we remove those
    link = link.replace('/splash.aspx?id=splash_', '')
    link = link.replace('0', '')
    link = link.replace('1', '')
    link = link.replace('2', '')
    link = link.replace('3', '')
    link = link.replace('4', '')
    link = link.replace('5', '')
    link = link.replace('6', '')
    link = link.replace('7', '')
    link = link.replace('8', '')
    link = link.replace('9', '')
    #clean up an extranious / if they exist
    if link[-1] == '/':
        link = link.rstrip(link[-1])
    return link

