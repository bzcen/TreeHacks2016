import json
import decimal
import boto3
from boto3.dynamodb.conditions import Key, Attr
import time
from datetime import datetime
from dateutil import tz

def convertUTCtoPST(timestring):
    # timestring of format: 2016-02-14 02:02:22
    from_zone = tz.gettz('UTC')
    to_zone = tz.gettz('PST')

    utc = datetime.strptime(timestring, '%Y-%m-%d %H:%M:%S')
    utc = utc.replace(tzinfo=from_zone)
    pst = utc.astimezone(to_zone)
    return datetime.strftime(pst, '%Y-%m-%d %H:%M:%S')

def convert(timestamp):
    #dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="https://dynamodb.us-east-1.amazonaws.com")
    table = dynamodb.Table('Recipes')

    with open("qualtricsResults.csv") as rf:
        rf.readline() # first 2 rows not data
        rf.readline()
        row = rf.readline()
        nodata = True
        while (row != ""):
            cols = row.split(',')
            #qtime = convertUTCtoPST(cols[7])
            qtime = cols[7]
            if qtime <= timestamp:
                row = rf.readline()
                continue
            
            # new data since last time stamp
            nodata = False
            title = cols[10]
            user_rating = 6 - float(cols[11])

            # get current rating
            response = table.query(KeyConditionExpression=Key('title').eq(title.lower()))
            if len(response['Items']) == 0:
                print 'Error: cannot find entry %s in database.' % title
                print 'Update rating failed for this instance.' 
                continue
            
            # assuming only 1 response with that title
            if len(response['Items']) > 1:
                print 'Error: found more than one result with name %s.' % title
                print 'Update rating failed for this instance.'
                continue

            current_rating = float(response['Items'][0]['ratings'])
            num_ratings = int(response['Items'][0]['num_ratings'])

            # compute new ratings
            new_rating = float(current_rating * num_ratings + user_rating) / (num_ratings + 1)
            new_rating = int(round(new_rating)) # get rounded int
            num_ratings += 1

            # update table entry
            response = table.update_item(
                Key={
                    'title': title.lower(),
                },
                UpdateExpression="set ratings = :r, num_ratings = :n",
                ExpressionAttributeValues={
                    ':r': new_rating,
                    ':n': num_ratings,
                },
                ReturnValues="UPDATED_NEW"
            )

            print "Updated ratings from %d to %d" % (current_rating, new_rating)
            row = rf.readline()
            
        if nodata:
            print 'No new reviews.'

if __name__ == "__main__":
    convert(datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %X\t'))


        
        
