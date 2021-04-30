import { parse } from 'graphql';
import { gql } from '@apollo/client';
import { getFieldsFromData } from 'processors';

export function insertArguments(queryString, argsString) {
  const query = parse(queryString);
  const documentNode = query.definitions?.[0];
  const fieldNode = documentNode.selectionSet.selections?.[0];
  const args = fieldNode.arguments;
  let breakLoc = null;
  let argWhereExists = false;

  if (args.length) {
    const argWhere = args.find(arg => arg.name.value == 'where');

    if (argWhere) {
      argWhereExists = true;
      breakLoc = argWhere.loc.end - 1;
    }
    else {
      breakLoc = args[args.length - 1].loc.end;
    }
  }
  else {
    breakLoc = fieldNode.loc.startToken.end;
  }

  const header = queryString.slice(0, breakLoc);
  const footer = queryString.slice(breakLoc);
  
  if (args.length) {
    return argWhereExists ? `${header},${argsString}${footer}` : `${header}, where: { ${argsString}${footer} }`;
  }
  else {
    return argWhereExists ? `${header}(${argsString})${footer}` : `${header}(where: {${argsString} })${footer}`;
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

export function checkSessionId(query) {
  const fields = extractFields(query);
  return fields && fields.findIndex(f => f == 'session_id') >= 0;
}

export function restrictSession(query, sessions) {
  if (checkSessionId(query) == false) {
    return query;
  }

  if (!sessions || sessions.length == 0) {
    sessions = [];
  }

  return insertArguments(query, `session_id: { _in: [${sessions.toString()}] }`);
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
