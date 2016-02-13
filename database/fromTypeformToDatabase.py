import json
import decimal
import boto3

# Helper class to convert a DynamoDB item to JSON.
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

def parseSteps(string):
    rawSteps = string.split('\n')
    parsed = []
    for rs in rawSteps:
        if isdigit(rs[:rs.index('.')]):  # user input: 1. preheat oven...
            parsed.append(rs[rs.index('.')+1:].strip())
        else:  # user input: preheaet oven...\nmix eggs...
            parsed.append(rs.strip())
    return parsed

def parseIngredients(string):
    return [x.strip() for x in string.split('\n')]

dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
table = dynamodb.Table('Recipes')

with open("typeformResults.json") as typeform_file:
    form = json.load(typeform_file, parse_float = decimal.Decimal)
    if len(form['responses']) == 0:
        print 'No new recipe entries.'

    for response in form['responses']:
        title = response['answers']['textfield_17284070']
        creator = response['answers']['textfield_17284595']
        print 'New recipe: %s, by: %s.' % (title, creator)

        category = ""
        for ans in [response['answers']['list_17284284_choice_22014743'],
                    response['answers']['list_17284284_choice_22014744'],
                    response['answers']['list_17284284_choice_22014745'],
                    response['answers']['list_17284284_choice_22014746']]:
            if len(ans) > 0:
               category = ans
               break

        steps = parseSteps(response['answers']['textarea_17284501'])
        ingredients = parseIngredients(response['answers']['textarea_17284500'])

        put_result = table.put_item(
            Item={
                'title': title,
                'creator': creator,
                'category': category,
                'calories': int(response['answers']['textfield_17284288'])
                'servings': int(response['answers']['textfield_17284291'])
                'steps': steps,
                'current_step': 0,
                'ingredients': ingredients
            }
        )

        print "PutItem succeeded:"
        print json.dumps(put_result, indent=4, cls=DecimalEncoder)

        
        
