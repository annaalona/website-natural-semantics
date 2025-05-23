export function hasOnlyOneAssignment(jsonObj) {
  if (jsonObj.type === "statements" && Array.isArray(jsonObj.body)) {
    return jsonObj.body.length === 1 && jsonObj.body[0].type === "assignment";
  }
  return false;
}

export function hasOnlyOneSkip(jsonObj) {
  if (jsonObj.type === "statements" && Array.isArray(jsonObj.body)) {
    return jsonObj.body.length === 1 && jsonObj.body[0].type === "skip";
  }
  return false;
}

export function wrapInStatements(json) {
  return {
    type: "statements",
    body: [json.length === 1 ? json[0] : json]
  };
}

export function countSemicolonsJSON(jsonObj) {
  let count = 0;

  if (Array.isArray(jsonObj)) {
    for (const item of jsonObj) {
      count += countSemicolonsJSON(item);
    }
  } else if (typeof jsonObj === 'object' && jsonObj !== null) {
    if (jsonObj.type === 'semicolon') {
      count += 1;
    }
    for (const key in jsonObj) {
      count += countSemicolonsJSON(jsonObj[key]);
    }
  }

  return count;
}

export function removeStatements(statement) {
  while (statement && statement.type === 'statements') {
    statement = statement.body.length === 1 ? statement.body[0] : {type: 'statements', body: statement.body};
  }
  return statement;
}
