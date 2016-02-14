import boto3

#dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="https://dynamodb.us-east-1.amazonaws.com")

table = dynamodb.create_table(
            TableName='RecipeState',
            KeySchema=[
                {
                    'AttributeName': 'test',
                    'KeyType': 'HASH'  # Partition key
                },
                ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'test',
                    'AttributeType': 'S'
                },
                ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
)
                
print "Table status:", table.table_status
