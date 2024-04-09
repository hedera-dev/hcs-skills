import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import {
  AccountId,
  PrivateKey,
  Client,
} from '@hashgraph/sdk';

// TODO need different `client` between server and browser components
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

export {
  client,
  operatorId,
  operatorKey,
};
