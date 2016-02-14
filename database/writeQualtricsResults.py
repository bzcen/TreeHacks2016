import urllib
import os



argv = os.sys.argv
timestamp = argv[1] +' ' + argv[2]


qualtrics_url = "https://survey.qualtrics.com//WRAPI/ControlPanel/api.php?API_SELECT=ControlPanel&Version=2.5&Request=getLegacyResponseData&User=treehackuser4&Token=VkL0uFUc9sxi87oZp37PvODnQAljYs8kkfp27URM&Format=CSV&SurveyID=SV_9MrgIbZ2qcCQRAp&LocalTime=1&StartDate="

with open('qualtricsResults.csv', 'w') as wf:
        ql_response = urllib.urlopen(qualtrics_url + timestamp)
        wf.write(ql_response.read())
        ql_response.close()
    #os.system('python fromQualtricsToDatabase.py ' + time_formatted) #fromQualtricsToDatabase.convert(time_formatted)
