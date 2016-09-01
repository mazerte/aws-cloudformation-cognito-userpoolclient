var CfnLambda = require('cfn-lambda');
var AWS = require('aws-sdk');

var UserPoolClient = require('./lib/user-pool-client');

function CognitoUserPoolClientHandler(event, context) {
  var CognitoUserPoolClient = CfnLambda({
    Create: UserPoolClient.Create,
    Update: UserPoolClient.Update,
    Delete: UserPoolClient.Delete,
    SchemaPath: [__dirname, 'src', 'schema.json']
  });
  // Not sure if there's a better way to do this...
  AWS.config.region = currentRegion(context);

  return CognitoUserPoolClient(event, context);
}

function currentRegion(context) {
  return context.invokedFunctionArn.match(/^arn:aws:lambda:(\w+-\w+-\d+):/)[1];
}

exports.handler = CognitoUserPoolClientHandler;
