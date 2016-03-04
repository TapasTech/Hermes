export * as GraphqlRest from './graphql-rest';
export * from './auth';

export function encodeField(field) {
  return JSON.stringify(field);
};
