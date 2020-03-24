export default {
  amplify: {
    Auth: {
      identityPoolId: "eu-central-1:095f17ef-6043-4c11-8985-fc8e608f2ac6",
      region: "eu-central-1",
      userPoolId: "eu-central-1_q4OHYJtEv",
      userPoolWebClientId: "1518mn5em9988t6lb76d4kr5kp",
      authenticationFlowType: 'CUSTOM_AUTH'
    },
    Analytics: {
      disabled: true
    },
    aws_appsync_graphqlEndpoint:
      "https://m4xevoyafjh4lepxeifynwug4e.appsync-api.eu-central-1.amazonaws.com/graphql",
    aws_appsync_region: "eu-central-1",
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"
  }
};
