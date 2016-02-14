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
    wf = open("recipes_data.json", 'w')
    alldata = []
    with open("typeformResults.json") as typeform_file:
        form = json.load(typeform_file, parse_float = decimal.Decimal)
        if len(form['responses']) == 0:
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

            item={
                    'title': title.lower(),
                    'actual_title': title,
                    'creator': creator.lower(),
                    'actual_creator': creator,
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

            alldata.append(item)

    print 'Writing to file...'
    json.dump(alldata, wf)
        

if __name__ == "__main__":
    convert()


        
        
