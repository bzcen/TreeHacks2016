/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var textHelper = (function () {
    var nameBlacklist = {
        player: 1,
        players: 1
    };

    return {
        completeHelp: 'Here\'s some things you can say,'
        + ' cook a recipe'
        + ' ask for its ingredients'
        + ' tell me its calories per serving'
        + ' how many servings does it make?'
        + ' how do people rate it'
        + ' and exit.',
        nextHelp: 'What would you like?',

        getRecipeName: function (recognizedRecipeName) {
            if (!recognizedRecipeName) {
                return undefined;
            }
            var split = recognizedRecipeName.indexOf(' '), newName;

            if (split < 0) {
                newName = recognizedRecipeName;
            } else {
                //the name should only contain a first name, so ignore the second part if any
                newName = recognizedRecipeName.substring(0, split);
            }
            if (nameBlacklist[newName]) {
                //if the name is on our blacklist, it must be mis-recognition
                return undefined;
            }
            return newName;
        },

        getRatingValue: function (recognizedRatingValue){
            if (!recognizedRatingValue){
                return undefined
            }
            return recognizedRatingValue;
        }
    };
})();
module.exports = textHelper;
