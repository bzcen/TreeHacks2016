/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var textHelper = require('./textHelper'),
    storage = require('./storage');

var registerIntentHandlers = function (intentHandlers, skillContext) {
    intentHandlers.NewRecipeIntent = function (intent, session, response) {
        var AWS = require("aws-sdk");

        AWS.config.update({
            region: "us-east-1",
            endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });


        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

        // get the recipe from the intent

        
        var recipeName = textHelper.getRecipeName(intent.slots.RecipeName.value);

        if (!recipeName) {
            response.ask('OK. What do you want to cook today?', 'What do you want to cook today?');
            return;
        }
        
        // query the recipeName from the DynamoDB database
        dynamodb.getItem({
                TableName: 'Recipes',
                Key: {
                    title: {
                        S: recipeName
                    },
                }
        }, function (err, data) {
            if (err || data === undefined) {
                 console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                 var text = 'I\'m sorry, no existing recipe for ' + recipeName + ' exists.';
                 response.tell(text);
                 return;

            } else {
                    console.log("Query succeeded.");
                    console.log(data);
                    console.log(data.Item.actual_title.S);
                    //data.Items.forEach(function(item) {
                    //console.log("something was found");
                    storage.newGame(session).save(function () {
                    var speechOutput = 'Ok. Let\'s cook ' + recipeName + '. Do you want to hear ingredients, begin cooking, or other?';
                    var repromptText = 'Do you want to hear ingredients, begin cooking, or other?';
                    response.ask(speechOutput, repromptText);
                    });

        
            }
        });

        dynamodb.getItem({
            TableName: 'RecipeState',
            Key: {
                Name: {
                    S: "test"
                }
            }
        }, function (err, data){
            if (err){
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            }
            if (data === undefined){
                console.log("unable to find the item");
            } else {
                // set the state holder to be the new recipe name
                console.log("found the item");
                console.log(data);

                dynamodb.putItem({
                    TableName: 'RecipeState',
                    Item: {
                        Name: {
                            S: 'test'
                        },
                        Recipe: {
                            S: recipeName
                        },
                        Step: {
                            N: '0'
                        }

                    }
                }, function (err, data) {
                    if (err){
                        console.log(err);
                    }
                    
                });
                console.log(data);
            }
        });
        return;
    }

    intentHandlers.ListIngredientsIntent = function (intent, session, response) {

        var AWS = require("aws-sdk");
        AWS.config.update({
            region: "us-east-1",
            endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var id;
        var list;
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

                    }else {
                        list = data.Item.ingredients.L;
                        console.log(list);
                        var text = "The ingredients are ";

                        var length = list.length;
                        for (var i = 0; i < length; i++){
                            text += list[i].S + ", ";
                        }

                        response.ask(text + ".", "Do you want to hear ingredients, begin cooking, or other?");


                    }
                });

            }
        });
    }

    intentHandlers.AskCaloriesIntent = function (intent, session, response) {
        var AWS = require("aws-sdk");
        AWS.config.update({
            region: "us-east-1",
            endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var id;
        var calories = 1000;
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

                    }else {
                        calories = data.Item.calories.N;
                        response.ask("This " + id + " recipe is " + calories.toString() + " calories per serving.", "Do you want to hear ingredients, begin cooking, or other?");
                    }
                });

            }
        });


       
    }

    intentHandlers.AskRatingIntent = function (intent, session, response) {
        var AWS = require("aws-sdk");
        AWS.config.update({
            region: "us-east-1",
            endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var id;
        var rating = 0;
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

                    }else {
                        rating = data.Item.ratings.N;
                        var tag = "";
                        if (parseFloat(rating) < 2){
                            tag = "not very good.";
                        } else if (parseFloat(rating) < 3){
                            tag = "decent.";
                        } else if (parseFloat(rating) < 4){
                            tag = "pretty good.";
                        } else if (parseFloat(rating) < 5){
                            tag = "really good.";
                        } else {
                            tag = "almost perfect.";
                        }
                        response.ask("Others think this " + id + " recipe is " + tag, "Do you want to hear ingredients, begin cooking, or other?");

                    }
                });

            }
        });
    }

    intentHandlers.AskNumServingsIntent = function (intent, session, response) {
        var AWS = require("aws-sdk");
        AWS.config.update({
            region: "us-east-1",
            endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var id;
        var servings = 100;
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

                    }else {
                        servings = data.Item.servings.N;
                        response.ask("This " + id + " recipe is designed for " + servings.toString() + " servings.", "Do you want to hear ingredients, begin cooking, or other?");

                    }
                });

            }
        });

    }


    intentHandlers.NextStepIntent = function (intent, session, response) {


        var step = 0;
        var id;
        var total_steps;
        var text;

        var AWS = require("aws-sdk");
        AWS.config.update({
            region: "us-east-1",
            endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

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
                step = data.Item.Step.N;
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

                    }else {
                        total_steps = data.Item.steps.L.length;
                        var list = data.Item.steps.L;
                        

                        if (step >= total_steps){
                            response.tell("It looks like you already finished the recipe! Enjoy!");
                            return;
                        }

                        text = list[step].S;

                        step++;
                        

                            dynamodb.putItem({
                            TableName: 'RecipeState',
                            Item: {
                            Name: {
                                S: 'test'
                            }   ,
                            Recipe: {
                                S: id
                            },
                                Step: {
                                    N: step.toString()
                                }

                                }
                            }, function (err, data) {
                                if (err){
                                console.log(err);
                                }
                                else {
                                    if (step >= total_steps){
                                        text += " Enjoy your " + id + "!";
                                        text += " Please tell me how you rate this recipe from 1 to 5.";
                                        response.tell(text);
                                    } else {
                                    response.ask(text, "Do you want to continue?");
                                    }
                                }
                            
                            });

                        

                    }
                });

            }
        });
    }

    intentHandlers.PreviousStepIntent = function (intent, session, response) {
        var step = 0;
        var id;
        var total_steps;
        var text;

        var AWS = require("aws-sdk");
        AWS.config.update({
            region: "us-east-1",
            endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

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
                step = data.Item.Step.N;
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

                    }else {
                        total_steps = data.Item.steps.L.length;

                        step = step - 2;

                        if (step <= -2){
                            response.ask("It looks like you haven't started cooking yet", "Would you like to cook?");
                            return;
                        } if (step === -1){
                            step = 0;
                        } 
                            var list = data.Item.steps.L;
                            text = list[step].S;

                            step++;
                            dynamodb.putItem({
                            TableName: 'RecipeState',
                            Item: {
                            Name: {
                                S: 'test'
                            }   ,
                            Recipe: {
                                S: id
                            },
                                Step: {
                                    N: step.toString()
                                }

                                }
                            }, function (err, data) {
                                if (err){
                                console.log(err);
                                }
                                else {
                                    
                                    response.ask(text, "Do you want to continue?");
                                }
                            
                            });
                        }
                });

            }
        });
    }

    intentHandlers.RepeatStepIntent = function (intent, session, response) {

        var step = 0;
        var id;
        var total_steps;
        var text;

        var AWS = require("aws-sdk");
        AWS.config.update({
            region: "us-east-1",
            endpoint: "https://dynamodb.us-east-1.amazonaws.com"
        });
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

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
                step = data.Item.Step.N;
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

                    }else {
                        total_steps = data.Item.steps.L.length;

                        step--;

                        if (step < 0 || step >= total_steps){
                            response.ask("It looks like you haven't started a recipe yet. What would you like to cook?", "What would you like to cook?");
                            return;
                        } else {
                            var list = data.Item.steps.L;
                        text = list[step].S;

                        step++;
                        if (step >= total_steps){
                            text += " Enjoy your " + id + "!";
                        }
                        response.tell(text);
                        return;
                        }
                    }
                });

            }
        });

    }




    intentHandlers.AddPlayerIntent = function (intent, session, response) {
        //add a player to the current game,
        //terminate or continue the conversation based on whether the intent
        //is from a one shot command or not.
        var recipeName = textHelper.getRecipeName(intent.slots.RecipeName.value);
        if (!recipeName) {
            response.ask('OK. What do you want to cook today?', 'What do you want to cook today?');
            return;
        }
        storage.loadGame(session, function (currentGame) {
            var speechOutput,
                reprompt;
            if (currentGame.data.scores[recipeName] !== undefined) {
                speechOutput = recipeName + ' has already joined the game.';
                if (skillContext.needMoreHelp) {
                    response.ask(speechOutput + ' What else?', 'What else?');
                } else {
                    response.tell(speechOutput);
                }
                return;
            }
            speechOutput = recipeName + ' has joined your game. ';
            currentGame.data.players.push(recipeName);
            currentGame.data.scores[recipeName] = 0;
            if (skillContext.needMoreHelp) {
                if (currentGame.data.players.length == 1) {
                    speechOutput += 'You can say, I am Done Adding Players. Now who\'s your next player?';
                    reprompt = textHelper.nextHelp;
                } else {
                    speechOutput += 'Who is your next player?';
                    reprompt = textHelper.nextHelp;
                }
            }
            currentGame.save(function () {
                if (reprompt) {
                    response.ask(speechOutput, reprompt);
                } else {
                    response.tell(speechOutput);
                }
            });
        });
    };

    intentHandlers.AddScoreIntent = function (intent, session, response) {
        //give a player points, ask additional question if slot values are missing.
        var recipeName = textHelper.getRecipeName(intent.slots.RecipeName.value),
            score = intent.slots.ScoreNumber,
            scoreValue;
        if (!recipeName) {
            response.ask('sorry, I did not hear the player name, please say that again', 'Please say the name again');
            return;
        }
        scoreValue = parseInt(score.value);
        if (isNaN(scoreValue)) {
            console.log('Invalid score value = ' + score.value);
            response.ask('sorry, I did not hear the points, please say that again', 'please say the points again');
            return;
        }
        storage.loadGame(session, function (currentGame) {
            var targetPlayer, speechOutput = '', newScore;
            if (currentGame.data.players.length < 1) {
                response.ask('sorry, no player has joined the game yet, what can I do for you?', 'what can I do for you?');
                return;
            }
            for (var i = 0; i < currentGame.data.players.length; i++) {
                if (currentGame.data.players[i] === recipeName) {
                    targetPlayer = currentGame.data.players[i];
                    break;
                }
            }
            if (!targetPlayer) {
                response.ask('Sorry, ' + recipeName + ' has not joined the game. What else?', recipeName + ' has not joined the game. What else?');
                return;
            }
            newScore = currentGame.data.scores[targetPlayer] + scoreValue;
            currentGame.data.scores[targetPlayer] = newScore;

            speechOutput += scoreValue + ' for ' + targetPlayer + '. ';
            if (currentGame.data.players.length == 1 || currentGame.data.players.length > 3) {
                speechOutput += targetPlayer + ' has ' + newScore + ' in total.';
            } else {
                speechOutput += 'That\'s ';
                currentGame.data.players.forEach(function (player, index) {
                    if (index === currentGame.data.players.length - 1) {
                        speechOutput += 'And ';
                    }
                    speechOutput += player + ', ' + currentGame.data.scores[player];
                    speechOutput += ', ';
                });
            }
            currentGame.save(function () {
                response.tell(speechOutput);
            });
        });
    };

    intentHandlers.TellScoresIntent = function (intent, session, response) {
        //tells the scores in the leaderboard and send the result in card.
        storage.loadGame(session, function (currentGame) {
            var sortedPlayerScores = [],
                continueSession,
                speechOutput = '',
                leaderboard = '';
            if (currentGame.data.players.length === 0) {
                response.tell('Nobody has joined the game.');
                return;
            }
            currentGame.data.players.forEach(function (player) {
                sortedPlayerScores.push({
                    score: currentGame.data.scores[player],
                    player: player
                });
            });
            sortedPlayerScores.sort(function (p1, p2) {
                return p2.score - p1.score;
            });
            sortedPlayerScores.forEach(function (playerScore, index) {
                if (index === 0) {
                    speechOutput += playerScore.player + ' has ' + playerScore.score + 'point';
                    if (playerScore.score > 1) {
                        speechOutput += 's';
                    }
                } else if (index === sortedPlayerScores.length - 1) {
                    speechOutput += 'And ' + playerScore.player + ' has ' + playerScore.score;
                } else {
                    speechOutput += playerScore.player + ', ' + playerScore.score;
                }
                speechOutput += '. ';
                leaderboard += 'No.' + (index + 1) + ' - ' + playerScore.player + ' : ' + playerScore.score + '\n';
            });
            response.tellWithCard(speechOutput, "Leaderboard", leaderboard);
        });
    };

    intentHandlers.ResetPlayersIntent = function (intent, session, response) {
        //remove all players
        storage.newGame(session).save(function () {
            response.ask('New game started without players, who do you want to add first?', 'Who do you want to add first?');
        });
    };

    intentHandlers['AMAZON.HelpIntent'] = function (intent, session, response) {
        var speechOutput = textHelper.completeHelp;
        if (skillContext.needMoreHelp) {
            response.ask(textHelper.completeHelp + ' So, how can I help?', 'How can I help?');
        } else {
            response.tell(textHelper.completeHelp);
        }
    };

    intentHandlers['AMAZON.CancelIntent'] = function (intent, session, response) {
        if (skillContext.needMoreHelp) {
            response.tell('Okay.  Whenever you\'re ready, you can start giving points to the players in your game.');
        } else {
            response.tell('');
        }
    };

    intentHandlers['AMAZON.StopIntent'] = function (intent, session, response) {
        if (skillContext.needMoreHelp) {
            response.tell('Okay.  Whenever you\'re ready, you can start giving points to the players in your game.');
        } else {
            response.tell('');
        }
    };
};
exports.register = registerIntentHandlers;
