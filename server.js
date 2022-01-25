const express = require('express');
const app = express();

// Init Middleware
app.use(express.json());

const WebSocket = require('ws');

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

let prevData = null;

async function getdata() {
  try {
    const data = await request('https://api.thegraph.com/subgraphs/name/matrixswap/matrixswap-perp', CANDLE_SUBSCRIPTION);
    if(prevData == null) {
      prevData = data;
      console.log(data);
    }
  
    if(prevData.candles[0].timestamp != data.candles[0].timestamp) {
      prevData = data;
      console.log(data);
    }
    
  } catch (error) {
    
  }
}


setInterval(getdata, 5000);

const client = new WebSocket('wss://api.thegraph.com/subgraphs/name/matrixswap/matrixswap-perp', [
	'graphql-ws',
]);

client.on('open', () => {
	console.log('open');
	// client.send(JSON.stringify({ id: 1 }));
	client.send(CANDLE_SUBSCRIPTION);
});
client.on('message', data => console.log('message', data));
// client.on('close', () => console.log('close'));
client.on('error', err => {
	console.log('error', err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
