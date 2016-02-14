import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="https://dynamodb.us-east-1.amazonaws.com")

table = dynamodb.Table('Reviews')

table.delete()

print "Table status:", table.table_status
