var AWS = require('aws-sdk');
var CfnLambda = require('cfn-lambda');

var cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

var toBoolean = function(obj, prop) {
  if (obj[prop] != undefined) obj[prop] = obj[prop] == "true";
}
var toInteger = function(obj, prop) {
  if (obj[prop] != undefined) obj[prop] = parseInt(obj[prop]);
}

var resolveParamsType = function(params) {
  toBoolean(params, "GenerateSecret");
  return params;
}

var Create = function(params, reply) {
  params = resolveParamsType(params);
  cognito.createUserPoolClient(params, function(err, data) {
    if (err) {
      console.error(err);
      reply(err);
    } else  {
      reply(null, data.UserPoolClient.ClientId , {
        ClientSecret: data.UserPoolClient.ClientSecret
      });
    }
  });
};

var Update = function(physicalId, params, oldParams, reply) {
  params.ClientId = physicalId;
  params.UserPoolId = oldParams.UserPoolId;
  delete params.GenerateSecret;

  cognito.updateUserPoolClient(resolveParamsType(params), function(err, data) {
    if (err) {
      console.error(err);
      reply(err);
    } else {
      reply(null, physicalId, {
        ClientId: data.UserPoolClient.ClientId,
        ClientSecret: data.UserPoolClient.ClientSecret
      });
    }
  });
};

var Delete = function(physicalId, params, reply) {
  var p = {
    ClientId: physicalId,
    UserPoolId: params.UserPoolId
  };
  cognito.deleteUserPoolClient(p, function(err, data) {
    if (err) console.error(err)
    reply(err, physicalId);
  });
};

exports.Create = Create;
exports.Update = Update;
exports.Delete = Delete;
