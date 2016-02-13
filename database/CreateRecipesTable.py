import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")

table = dynamodb.create_table(
            TableName='Recipes',
            KeySchema=[
                {
                    'AttributeName': 'title',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'creator',
                    'KeyType': 'RANGE'  # Sort Key
                }
                ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'title',
                    'AttributeType': 'S',
                },
                {
                    'AttributeName': 'creator',
                    'AttributeType': 'S',
                },
                {
                    'AttributeName': 'category',
                    'AttributeType': 'S',
                },
                {
                    'AttributeName': 'servings',
                    'AttributeType': 'N',
                },
                {
                    'AttributeName': 'steps',
                    'AttributeType': 'S',
                },
                {
                    'AttributeName': 'ingredients',
                    'AttributeType': 'S',
                }
                ], # end AttributeDefinitions[]
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
)
                
print "Table status:", table.table_status
