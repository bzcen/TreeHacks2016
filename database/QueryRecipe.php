<?php
require 'vendor/autoload.php';

date_default_timezone_set('UTC');

use Aws\DynamoDb\Exception\DynamoDbException;

$sdk = new Aws\Sdk([
    'region'   => 'us-east-1',
    'version'  => 'latest'
]);

$dynamodb = $sdk->createDynamoDb();

$tableName = 'Recipes';
$searchTerm = 'cheesecake';

# The Query API is paginated. Issue the Query request multiple times.
do {
    echo "Querying table $tableName for $searchTerm\n";

    $request = [
        'TableName' => $tableName,
        'KeyConditionExpression' => 'title = :_title',
        'ExpressionAttributeValues' =>  [
            ':_title' => ['S' => $searchTerm]
        ],
    ];

    $response = $dynamodb->query($request);

    foreach ($response['Items'] as $key => $value) {
        echo 'Id: ' . $value['Id']['S'] . "\n";
        echo 'ReplyDateTime: ' . $value['ReplyDateTime']['S'] . "\n";
        echo 'Message: ' . $value['Message']['S'] . "\n";
        echo 'PostedBy: ' . $value['PostedBy']['S'] . "\n"; 
        echo "\n";
    }

# If there is no LastEvaluatedKey in the response, then 
# there are no more items matching this Query
} while(isset($response['LastEvaluatedKey'])); 

?>