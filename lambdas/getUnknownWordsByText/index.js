const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
const dynamodb = new AWS.DynamoDB();
const lambda = new AWS.Lambda();
const _ = require('lodash');

exports.handler = async (event) => {
    // TODO implement
    //console.log(event);
    console.log("Start");
    
    const payloadStr = JSON.stringify({text: event.args.text});
    
    //console.log(payloadStr);
    
    const params = {
        FunctionName: 'splitTextInWords',
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: payloadStr
    };
    
    //console.log(params);
    
    let items = await (new Promise((resolve, reject) => {
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

    console.log("splitTextInWords finished!")
    
    //order the words according to how often they encounter
    let words = _(items)
      .map(item => item.lemma)
      .groupBy(wrd => wrd)
      .mapValues((value, key) => {
        return { word: key, count: value.length };
      })
      .values()
      .orderBy(["count"], ["desc"])
      .map(wordCount => wordCount.word)
      //.mapKeys((value, key) => value.length)
      .value();

    //console.log(words);
    console.log("Ordering words by frequency finished!")
    
    
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
        //console.log("Success", data.Item);
        
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

    console.log("Got words from vocabulary and calculated unknown words");
    
    
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
          //console.log(data);
          //console.log("Success", data);
          resolve(JSON.parse(data.Payload).body);
        }});
      
    }));

    unknownWordsAndTheirTranslations = unknownWordsAndTheirTranslations.map(wordAndTranslation => {return {...wordAndTranslation, exclusionForms: []}});

    console.log("Got translations of unknown words");


    const getExclusionsByWordsPayloadStr = JSON.stringify({words: unknownWords});
    
    const paramsGetExclusionsByWords = {
      FunctionName: 'getExclusionsByWords',
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: getExclusionsByWordsPayloadStr
    };
    
    
    //console.log(paramsGetExclusionsByWords);
  
    let unknownWordsAndExclusions = await (new Promise((resolve, reject) => {
      lambda.invoke(paramsGetExclusionsByWords, function(err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        } else {
          //console.log(data);
          //console.log("Success", data);
          resolve(JSON.parse(data.Payload).body);
        }});
      
    }));

    console.log("Got exclusions of unknown words");
    
    //console.log("before join")
    //console.log(unknownWordsAndExclusions);
    //console.log(unknownWordsAndTheirTranslations);

    let unknownWordsWithTranslationsAndExclusions = 
      leftJoinArrays(unknownWordsAndTheirTranslations, unknownWordsAndExclusions);
    //console.log(unknownWordsWithTranslationsAndExclusions)
    console.log("Translations and exclusions has been joined! Finish.");
  
    return {words: unknownWordsWithTranslationsAndExclusions};
};

const leftJoinArrays = (arr1, arr2) => {
  const sortedArr2 = _.sortBy(arr2, el => el.word);
  const sortedArrKeys = sortedArr2.map(el => el.word);
  return arr1.map(el1 => {
    return _.assign(el1, sortedArr2[_.sortedIndexOf(sortedArrKeys, el1.word)]);
  });
};

