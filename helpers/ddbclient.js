const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDBClient({ region: 'us-east-1'  });

module.exports =  { ddbClient };