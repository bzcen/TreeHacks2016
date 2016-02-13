import urllib
import time, datetime
import os
import fromTypeformToDatabase


url = "https://api.typeform.com/v0/form/yvDTj0?key=dd8656976738564903e82af18c8ae0c9577ea222&completed=true"

timestamp = time.time()
while True:
    # every minute (or longer), download from typeform potential entries
    print datetime.datetime.fromtimestamp(timestamp).strftime('%Y %b %d %X\t'),
    with open('typeformResults.json', 'w') as wf:
        response = urllib.urlopen(url + "&since=" + str(timestamp))
        timestamp = int(time.time()) - 5  # minus 5 seconds just in case we miss something.
        wf.write(response.read())
    fromTypeformToDatabase.convert()
    time.sleep(60)
    
