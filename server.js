const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jsonWebToken = require('jsonwebtoken');
const { GraphQLClient, gql } = require('graphql-request');

const HASURA_ENDPOINT = 'https://kepler-data-center.hasura.app/v1/graphql';
const HASURA_GHOST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iLCJ1c2VyIiwiZ3Vlc3QiLCJnaG9zdCJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJnaG9zdCIsIngtaGFzdXJhLXVzZXItaWQiOiJnaG9zdCJ9fQ.GE38lWgvsKPOaHZS7Dcj89-E0YGugF6je3nXvxjYKkU';
const HASURA_JWT_SECRETE_KEY = 'sD9DQ0t7bptsa1E0kOUgzU2adr78N59V';
const PORT = process.env.PORT || 8080

const client = new GraphQLClient(HASURA_ENDPOINT, {
  headers: {
    'Authorization': `Bearer ${HASURA_GHOST_TOKEN}`
  }
});

const GQL_GET_TOKEN = gql`
query MyQuery($token: String!) {
  signal_db_privileges(where: {user_token: {_eq: $token} }) {
    id, user_token, role
  }
}
`;

const GQL_INSERT_TOKEN = gql`
mutation($token: String!) {
  insert_signal_db_privileges_one(
    object: {
      user_token: $token
    }
  ) {
    id
    user_token
    role
  }
}
`;

const generateJWT = ({ role, user_token }) => {
  return jsonWebToken.sign({
      "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["ADMIN", "USER", "GUEST", 'NOT_ALLOWED'],
          "x-hasura-default-role": role,
          "x-hasura-user-id": user_token
      }
  }, HASURA_JWT_SECRETE_KEY, { algorithm: 'HS256', noTimestamp: true });
};

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/api/get_token', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");  
  const userToken = req.body.user_token;
  client
    .request(GQL_GET_TOKEN, { token: userToken })
    .then(data => {
      const user_info = data.signal_db_privileges?.[0];

      if (user_info) {
        const jwt = generateJWT(user_info);
        res.json({ jwt, user_info });
      }
      else {
        client
          .request(GQL_INSERT_TOKEN, { token: userToken })
          .then(data => {
            const user_info = data.insert_signal_db_privileges_one;
            const jwt = generateJWT(user_info);
            res.json({ jwt, user_info });
          });
      }
    })
    .catch(err => console.log(err))
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
