var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var ingredients;
var value;
console.log(dynamodb);
dynamodb.getItem({
    TableName: 'RecipeState',
    Key: {
        Name: {
            S: "test"
        }
    }
}, function (err, data){
    console.log(data);
    if (err){
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        return;
    }
    if (data === undefined){
        console.log("unable to find the item");
        return;
    } else {
        console.log("found the item");
        id = data.Item.Recipe.S;
        console.log(id);
        dynamodb.getItem({
            TableName: 'Recipes',
            Key: {
                title: {
                    S: id
                }
            }
        }, function (err, data){
            if (err){
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            }
            if (data === undefined){
                console.log("unable to find the item");
            } else {
                ingredients = data.Item.ingredients.L;
                console.log(ingredients);
                var length = ingredients.length;
		// for each ingredient, add the amount to Ingredients Table
                for (var i = 0; i < length; i++){
		    dynamodb.getItem({
			TableName: 'Ingredients',
			Key: {
			    Name: {
				S: ingredients[i].S
			    }
			}
		    }, function (err, data){
			console.log(data);
			if (err){
			    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
			    return;
			}
			if (data === undefined){
			    console.log("unable to find the item");
			    return;
			} else {
			    console.log("found the ingredient");
			    id = data.Item.ingredient.S;
			    console.log(id);

			    // update ingredient value
			    var value = data.Item.value.N;
			    value++;
			    dynamodb.putItem({
				TableName: 'Ingredients',
				Item: {
				    Name: {
					S: ingredient
				    },
				    value: {
					N: value
				    }
				}
			    }, function(err, data) {
				if (err){
                                    console.log(err);
                                }
			    });
			}
		    });
		}
	    }
	});
    }
});
