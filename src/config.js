import { GraphqlRest } from './utils';

GraphqlRest.config({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});
