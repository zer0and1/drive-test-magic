import { parse } from 'graphql';
import { gql } from '@apollo/client';
import { getFieldsFromData } from 'processors';

export function insertArguments(queryString, argsString) {
  const query = parse(queryString);
  const documentNode = query.definitions?.[0];
  const fieldNode = documentNode.selectionSet.selections?.[0];
  const args = fieldNode.arguments;
  let breakLoc = null;

  if (args.length) {
    breakLoc = args[args.length - 1].loc.end;
  }
  else {
    breakLoc = fieldNode.loc.startToken.end;
  }

  const header = queryString.slice(0, breakLoc);
  const footer = queryString.slice(breakLoc);

  if (args.length) {
    return `${header},${argsString}${footer}`;
  }
  else {
    return `${header}(${argsString})${footer}`;
  }
};

export function extractFields(query) {
  if (typeof query == 'string') {
    query = gql(query);
  }

  const documentNode = query.definitions?.[0];
  const fieldNode = documentNode.selectionSet.selections?.[0];
  const fields = fieldNode.selectionSet?.selections.map(f => f.name.value);

  return fields;
};

export function extractOperation(query) {
  if (typeof query == 'string') {
    query = gql(query);
  }

  const documentNode = query.definitions?.[0];
  const fieldNode = documentNode.selectionSet.selections?.[0];

  return fieldNode.name.value;
};

export function restrictSession(query, sessions) {
  if (!sessions || sessions.length == 0) {
    return query;
  }

  return insertArguments(query, `where: { session_id: { _in: [${sessions.toString()}] } }`);
};

export function filterWithList(src, field, list) {
  if ( ! list || list.length == 0) {
    return src;
  }

  return src.filter(o => list.findIndex(v => v == o[field]) >= 0);
};

export function makeDataset(query, data, sessions) {
  const orders = extractFields(query);
  const filteredData = filterWithList(data, 'session_id', sessions);
  const fields = getFieldsFromData(filteredData, orders);
  const rows = [];

  filteredData.forEach(item => rows.push(orders.map(field => item[field])));

  return { fields, rows };
};
