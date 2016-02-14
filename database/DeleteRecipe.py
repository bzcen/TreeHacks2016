import boto3
from botocore.exceptions import ClientError
import json
import decimal

# Helper class to convert a DynamoDB item to JSON.
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="https://dynamodb.us-east-1.amazonaws.com")

table = dynamodb.Table('Recipes')

title = "pizza"
#creator = "amy"

print("Attempting a delete...")

response = table.delete_item(
    Key={
        'title': title,
        #'creator': creator
    }
)

print("DeleteItem succeeded:")
print(json.dumps(response, indent=4, cls=DecimalEncoder))
