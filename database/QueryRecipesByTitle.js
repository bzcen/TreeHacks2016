var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var title = "cheesecake";

console.log("Querying for recipes with title " + title);

var params = {
    TableName : "Recipes",
    KeyConditionExpression: "#tle = :tttt",
    ExpressionAttributeNames:{
        "#tle": "title"
    },
    ExpressionAttributeValues: {
        ":tttt":title
    }
};

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item.year + ": " + item.title);
        });
    }
});
