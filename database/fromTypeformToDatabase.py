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
        try:
            period = rs.index('.')
            if rs[:period].isdigit():  # user input: 1. preheat oven...
                parsed.append(rs[rs.index('.')+1:].strip())
            else:  # user input: preheat oven...\nmix eggs...
                parsed.append(rs.strip())
        except:
            # period does not exist in string
            parsed.append(rs.strip())

        
    return parsed

def parseIngredients(string):
    return [x.strip() for x in string.split('\n')]

def convert():
    #dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="http://localhost:8000")
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="https://dynamodb.us-east-1.amazonaws.com")
    table = dynamodb.Table('Recipes')

    with open("typeformResults.json") as typeform_file:
        form = json.load(typeform_file, parse_float = decimal.Decimal)
        if len(form['responses']) == 0:
            print 'No new recipes.',
            return

        for response in form['responses']:
            title = response['answers']['textfield_17284070']
            creator = response['answers']['textfield_17284595']
            print 'New recipe: %s, by: %s.' % (title, creator)

            categories = filter(None, [response['answers']['list_17284284_choice_22014743'],
                        response['answers']['list_17284284_choice_22014744'],
                        response['answers']['list_17284284_choice_22014745'],
                        response['answers']['list_17284284_choice_22014746']])
            steps = parseSteps(response['answers']['textarea_17284501'])
            ingredients = parseIngredients(response['answers']['textarea_17284500'])

            put_result = table.put_item(
                Item={
                    'actual_title': title,
                    'title': title.lower(),
                    'actual_creator': creator,
                    'creator': creator.lower(),
                    'categories': categories,
                    'calories': int(response['answers']['textfield_17284288']),
                    'servings': int(response['answers']['textfield_17284291']),
                    'steps': steps,
                    'current_step': 0,
                    'ingredients': ingredients,
                    'ratings': 5,
                    'num_ratings': 1,
                    'times_made': 0,
                    'time_to_make': 30
                }
            )

            print "PutItem succeeded:"
            print json.dumps(put_result, indent=4, cls=DecimalEncoder)

if __name__ == "__main__":
    convert()


        
        
