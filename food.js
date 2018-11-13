'use strict';

const AWS = require('aws-sdk'), documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.remind = (event, context, callback) => {
  const reply = (message) => {
    callback(null, {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: message,
        },
        shouldEndSession: true,
      },
    });
  }

  const spice = event.request.intent.slots.spice.value;
  console.log(`Requested a reminder to buy ${spice}`);
  const params = {
    Item : {
      "name": spice
    },
    TableName: "foodTable"
  };

  documentClient.put(params, (err, data) => {
    if (err) {
      console.error(err);
      reply("I'm afraid I can't do that dave");
    }
    reply(`My ${spice} brings all the boys to the yard`);
    return;
  });
};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: "foodTable"
  };
  documentClient.scan(params, (error, result) => {
    if(error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the food.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};