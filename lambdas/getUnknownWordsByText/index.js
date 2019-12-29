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


    unknownWordsAndTheirTranslations = unknownWordsAndTheirTranslations.map(wordAndTranslation => {return {...wordAndTranslation, exclusionForms: []}});

    let unknownWordsAndExclusions = await getExclusionsByWords(unknownWords);

    let unknownWordsWithTranslationsAndExclusions = 
      leftJoinArrays(unknownWordsAndTheirTranslations, unknownWordsAndExclusions);
  
    return {words: unknownWordsWithTranslationsAndExclusions};
};

const leftJoinArrays = (arr1, arr2) => {
  const sortedArr2 = _.sortBy(arr2, el => el.word);
  const sortedArrKeys = sortedArr2.map(el => el.word);
  return arr1.map(el1 => {
    return _.assign(el1, sortedArr2[_.sortedIndexOf(sortedArrKeys, el1.word)]);
  });
};


const getExclusionsByWords = async (words) => {
  const MAX_AMAZON_DB_GET_BATCH_LIMIT = 100;
  const chunks = _(words).chunk(MAX_AMAZON_DB_GET_BATCH_LIMIT).value();
  const chuncksWithExclusions = [];
  for (let ch of chunks) {
    const chWithExcl = await getExlusionsForChunk(ch);
    chuncksWithExclusions.push(chWithExcl);
  }
  return _(chuncksWithExclusions)
    .flatten()
    .value();
}

const getExlusionsForChunk = async (chunkOfWords) => {
   //load words from DB
   const chunkKeys = _(chunkOfWords).map(word => {
     return {
       "lemma":{"S": word}
     }
   }).value();
   console.log(chunkKeys);
   let query = {
      RequestItems: {
        "exclusion-words": {
          Keys: chunkKeys
        }
      }
    };

  let wordsAndExclusions = [];
  
  try {
    const data = await dynamodb.batchGetItem(query).promise();
    wordsAndExclusions = _(data["Responses"]["exclusion-words"])
        .map(row => {
          return {
            word: row["lemma"]["S"],
            exclusionForms: _(row["exclusions"]["L"]).map(excl => excl["S"]).value()};
        })
        .value();
    
  } catch (error) {
    console.log("Error", error);
  }
  

  return wordsAndExclusions;
};

