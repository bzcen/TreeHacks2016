import boto3
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

title = "cheesecake"
item = "ratings"

response = table.update_item(
    Key={
        'title': title,
    },
    UpdateExpression="set %s = :r" % item,
    ExpressionAttributeValues={
        ':r': decimal.Decimal(5.5),
    },
    ReturnValues="UPDATED_NEW"
)

print("PutItem succeeded:")
print(json.dumps(response, indent=4, cls=DecimalEncoder))
