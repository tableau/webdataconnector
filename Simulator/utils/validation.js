import validate from 'validate.js';
import _ from 'underscore';

export function validateData(data) {
  let i;
  let entry;

  if (validate.isArray(data)) {
    for (i = 0; i < data.length; i++) {
      entry = data[i];
      if (!(validate.isArray(entry) || validate.isObject(entry))) {
        console.error('Each entry within the array passed ' +
                      'through table.appendRows must be an array or object.');
        return false;
      }
    }
  } else {
    console.error('table.appendRows must be passed an array.');
    return false;
  }

  return true;
}

export function validateSchema(schema) {
  let errors;
  let hasTableErrors = false;
  let hasColumnErrors = false;

  const tableConstraints = {
    id: {
      presence: true,
      format: '^[a-zA-Z0-9_]*$',
    },
    columns: {
      presence: true,
    },
  };

  const columnConstraints = {
    id: {
      presence: true,
      format: '^[a-zA-Z0-9_]*$',
    },
    dataType: {
      presence: true,
    },
  };

  _.forEach(schema, (table) => {
    errors = validate(table, tableConstraints);
    hasTableErrors = (errors !== undefined);

    if (!hasTableErrors) {
      // table is valid, now check each column
      _.forEach(table.columns, (column) => {
        errors = validate(column, columnConstraints);
      });

      hasColumnErrors = (errors !== undefined);
    }

    if (hasTableErrors || hasColumnErrors) {
      // If there were errors in either table of column validation, log them all
      _.forEach(Object.keys(errors), (key) => {
        _.forEach(errors[key], (err) => {
          console.error(err);
        });
      });
    }
  });

  // Errors will be undefined if all validation checks passed
  return (errors === undefined);
}
