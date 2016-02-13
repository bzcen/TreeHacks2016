import boto3
import json
import decimal

dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
table = dynamodb.Table('Recipes')

with open("recipes_data.json") as json_file:
    recipes = json.load(json_file, parse_float = decimal.Decimal)
    for recipe in recipes:
        title = recipe['title']
        creator = recipe['creator']
        print 'Adding recipe: %s, by %s' % (title, creator)

        table.put_item( Item = { 'title': title,
                                 'creator': creator,
                                 'category': recipe['category'],
                                 'calories': int(recipe['calories']),
                                 'servings': int(recipe['servings']),
                                 'steps': recipe['steps'],
                                 'current_step': 0,
                                 'ingredients': recipe['ingredients']
                                }
                      )
        
        
        

