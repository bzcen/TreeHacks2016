import urllib
import time, datetime
import os
import fromTypeformToDatabase
import fromQualtricsToDatabase

print 'Starting server...'
typeform_url = "https://api.typeform.com/v0/form/yvDTj0?key=dd8656976738564903e82af18c8ae0c9577ea222&completed=true&since="
qualtrics_url = "https://survey.qualtrics.com//WRAPI/ControlPanel/api.php?API_SELECT=ControlPanel&Version=2.5&Request=getLegacyResponseData&User=treehackuser4&Token=VkL0uFUc9sxi87oZp37PvODnQAljYs8kkfp27URM&Format=CSV&SurveyID=SV_9MrgIbZ2qcCQRAp&LocalTime=1&StartDate=" # 2016-02-14%2B02%253A02%253A22   = 2016-02-14 02:02:22     space = %2B, : = %253A

#https://survey.qualtrics.com/WRAPI/ControlPanel/api.php?API_SELECT=ControlPanel&Version=2.5&Request=getLegacyResponseData&User=treehackuser4&Token=B7gjcxi3UVp2KltUy1pZQZqHywTcYoKRNh0aHa5h&Format=JSON&SurveyID=SV_9MrgIbZ2qcCQRAp&

timestamp = time.time()
while True:
    # format time
    time_formatted = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %X\t')
    #print time_formatted,
    """
    # every minute (or longer), download from typeform potential entries
    with open('typeformResults.json', 'w') as wf:
        tf_response = urllib.urlopen(typeform_url + str(timestamp))
        wf.write(tf_response.read())
        tf_response.close()
    os.system('python fromTypeformToDatabase.py') # fromTypeformToDatabase.convert()
    """
    # every minute (or longer), check qualtrics for new incoming reviews
    with open('qualtricsResults.csv', 'w') as wf:
        ql_response = urllib.urlopen(qualtrics_url + str(time_formatted))
        wf.write(ql_response.read())
        ql_response.close()
    os.system('python fromQualtricsToDatabase.py ' + time_formatted) #fromQualtricsToDatabase.convert(time_formatted)

    timestamp = int(time.time())#  - 10  # minus 10 seconds just in case we miss something.
    #time.sleep(60)
    time.sleep(5)
    
