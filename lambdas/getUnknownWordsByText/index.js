const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
const dynamodb = new AWS.DynamoDB();
const lambda = new AWS.Lambda();
const _ = require('lodash');

exports.handler = async (event) => {
    // TODO implement
    console.log(event);
    
    const payloadStr = JSON.stringify({text: event.args.text});
    
    console.log(payloadStr);
    
    const params = {
        FunctionName: 'splitTextInWords',
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: payloadStr
    };
    
    console.log(params);
    
    let words = await (new Promise((resolve, reject) => {
       lambda.invoke(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        } else {
          console.log(data);
          console.log("Success", data);
          resolve(JSON.parse(data.Payload).body);
        }});
      
    }));
    
    //order the words according to how ofter they encounter
    words = _(words)
      .groupBy(wrd => wrd)
      .mapValues((value, key) => {
        return { word: key, count: value.length };
      })
      .values()
      .orderBy(["count"], ["desc"])
      .map(wordCount => wordCount.word)
      //.mapKeys((value, key) => value.length)
      .value();
    console.log(words);
    
    
    //load words from DB
    var query = {
      TableName: 'vocabularies',
      Key: {
        user: {"S": event.user.sub}
      }
    };
    
    let unknownWords = [];
    
    await dynamodb.getItem(query, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Item);
        
        // we have to check, because dynamo doesn't keep empty collections
        let vocabularyWords = [];
        let vocabularyWordsDbSet = data["Item"]["words"];
        if(vocabularyWordsDbSet) {
          vocabularyWords = vocabularyWordsDbSet["SS"];
        }
        
        //substruct
        let wordsSet = new Set(words);
        let vocabularyWordsSet = new Set(vocabularyWords);
        vocabularyWordsSet.forEach(vw => wordsSet.delete(vw));
        unknownWords = Array.from(wordsSet);
      }
    }).promise();
    
    
    const unknownWordsStr = JSON.stringify({words: unknownWords});
    
    const paramForTranslation = {
        FunctionName: 'getTranslationsByWords',
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: unknownWordsStr
    };
    
    
    let unknownWordsAndTheirTranslations = await (new Promise((resolve, reject) => {
       lambda.invoke(paramForTranslation, function(err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        } else {
          console.log(data);
          console.log("Success", data);
          resolve(JSON.parse(data.Payload).body);
        }});
      
    }));
    
    console.log(unknownWordsAndTheirTranslations);
    
    return {words: unknownWordsAndTheirTranslations};
};
