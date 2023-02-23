from bs4 import BeautifulSoup as BS
import requests
from csv import writer
import csv
import gspread
import time
import re

def run(filePath, sheetName, pageName):
  sa = gspread.service_account(filename = filePath)
  sh = sa.open_by_key(sheetName)
  worksheet = sh.worksheet(pageName)
  lst = worksheet.get_all_values()
  lst.pop(0) #removes headers
  return lst

def addSchoolRow(filePath, sheetName, pageName, teamName, ids, logo, row):
    sa = gspread.service_account(filename = filePath)
    sh = sa.open_by_key(sheetName)
    worksheet = sh.worksheet(pageName)
    worksheet.update('A' + str(row) + ':C' + str(row), [[teamName, ids, logo]])

def updateRedirect(link):
    #takes a link. returns either link or the redirect
    try:
        response = requests.get(link)
        if response.history:
            for resp in response.history:
                link = response.url
    except:
        pass #incase too many redirects in which case we quit
    link = link.replace('/index.aspx','')
    link = link.replace('/landing/index', '')
    link = link.replace('/splash.aspx?id=splash_16', '')
    if link[-1] == '/':
        link = link.rstrip(link[-1])
    return link

