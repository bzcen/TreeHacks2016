import boto3
import json
import decimal
from boto3.dynamodb.conditions import Key, Attr

# Helper class to convert a DynamoDB item to JSON.
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
table = dynamodb.Table('Recipes')

query = "pasta"

response = table.query(
    KeyConditionExpression=Key('title').eq(query)
)

print 'Query returned %d results.' % len(response['Items'])
for i in response['Items']:
    print 'Recipe: %s, Creator: %s' % (i['title'], i['creator'])
