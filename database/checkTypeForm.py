import urllib
import time
import os


url = "https://api.typeform.com/v0/form/yvDTj0?key=dd8656976738564903e82af18c8ae0c9577ea222&completed=true"
conversion_program = "fromTypeformToDatabase.py"

while True:
    # every minute, download from typeform potential entries
    timestamp = int(time.time())
    with open('typeformResults.json', 'w') as wf:
        response = urllib.urlopen(url + "&since=" + str(timestamp))
        wf.write(response.read())
    os.system('python %s' % conversion_program)
    time.sleep(60)
    
