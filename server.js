const express = require('express');
const app = express();

// Init Middleware
app.use(express.json());

const { request, gql } = require('graphql-request');

const CANDLE_SUBSCRIPTION = gql`{
  candles(first: 1, orderBy:timestamp, orderDirection:desc, where: { amm: "0xb95604ae712e5ba5c84c7260a1e6bb534f0993d1", interval: 60 }) {
    id
    timestamp
    interval
    open
    close
    low
    high
    volume
  }
}
`;

request('https://api.thegraph.com/subgraphs/name/matrixswap/matrixswap-perp', CANDLE_SUBSCRIPTION).then((data) => console.log(data))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
