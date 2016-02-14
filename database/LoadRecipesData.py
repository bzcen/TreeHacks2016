import boto3
import json
import decimal

#dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="https://dynamodb.us-east-1.amazonaws.com")
table = dynamodb.Table('Recipes')

with open("recipes_data.json") as json_file:
    recipes = json.load(json_file, parse_float = decimal.Decimal)
    for recipe in recipes:
        title = recipe['title']
        creator = recipe['creator']
        print 'Adding recipe: %s, by %s' % (title, creator)

        table.put_item( Item = { 'actual_title': title,
                                 'title': title.lower(),
                                 'actual_creator': creator,
                                 'creator': creator.lower(),
                                 'categories': recipe['categories'],
                                 'calories': int(recipe['calories']),
                                 'servings': int(recipe['servings']),
                                 'steps': recipe['steps'],
                                 'current_step': recipe['current_step'],
                                 'ingredients': recipe['ingredients'],
                                 'ratings': recipe['ratings'],
                                 'num_ratings': recipe['num_ratings']
                                }
                      )
        
        
        

