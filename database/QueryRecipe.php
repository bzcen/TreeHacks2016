require 'aws/aws-autoloader.php';

$sdk = new Aws\Sdk([
    'region'   => 'us-east-1',
    'version'  => 'latest'
]);

$dynamodb = $sdk->createDynamoDb();

$response = $dynamodb->scan([
    'TableName' => 'Recipes'
]);

foreach ($response['Items'] as $key => $value) {
    echo 'Title: ' . $value['title']['S'] . "\n";
    echo 'Calories: ' . $value['calories']['N'] . "\n";
    echo 'Servings: ' . $value['servings']['N'] . "\n";
    echo 'Categories: ' . $value['categories']['S'] . "\n";
    echo 'Steps: ' . $value['steps']['SS'] . "\n";
    echo 'Ingredients: ' . $value['ingredients']['SS'] . "\n";
    echo "\n";
}