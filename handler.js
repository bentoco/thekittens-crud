'use strict';
const aws = require('aws-sdk');

module.exports = {
  create: async (event, context) => {
    let bodyObj = {};
    try {
      bodyObj = JSON.parse(event.body);
    } catch (jsonError) {
      console.log('There was an error parsing the body', jsonError);
      return {
        statusCode: 400,
      };
    }
    if (
      typeof bodyObj.name === 'undefined' ||
      typeof bodyObj.age === 'undefined'
    ) {
      console.log('Missing parameters');
      return {
        statusCode: 400,
      };
    }

    let putParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Item: {
        name: bodyObj.name,
        age: bodyObj.age,
      },
    };
    let putResult = {};
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      putResult = await dynamodb.put(putParams).promise();
    } catch (putError) {
      console.log('There was a problem putting the kitten');
      console.log('putParams', putParams);
      return {
        statusCode: 500,
      };
    }
    return {
      statusCode: 201,
    };
  },
  list: async (event, context) => {
    let scanParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
    };

    let scanResult = {};
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      scanResult = await dynamodb.scan(scanParams).promise();
    } catch (scanError) {
      console.log('There was a problem scanning the kittens');
      console.log('scanError', scanError);
      return {
        statusCode: 500,
      };
    }

    if (
      scanParams.Items === null ||
      !Array.isArray(scanResult.Items) ||
      scanResult.Items.length === 0
    ) {
      return {};
    }
  },
  get: async (event, context) => {},
  update: async (event, context) => {},
  delete: async (event, context) => {},
};
