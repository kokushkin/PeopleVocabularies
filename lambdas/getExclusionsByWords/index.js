const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
const dynamodb = new AWS.DynamoDB();
const _ = require('lodash');

exports.handler = async (event) => {
    const wordsAndExclusions = await getExclusionsByWords(event.words);
    
    const result = {
      statusCode: 200,
      body: wordsAndExclusions,
  };
    console.log(result)
    return result;
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
