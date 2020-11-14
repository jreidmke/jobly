/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: an object with keys of columns you want to update and values with
 *          updated values
 * - key: the column that we query by (e.g. username, handle, id), the table's primary key.
 * - id: current record ID, the primary key's value
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */

function sqlForPartialUpdate(table, items, key, id) {
  // keep track of item indexes
  // store all the columns we want to update and associate with vals

  let idx = 1;
  let columns = [];

  // filter out keys that start with "_" -- we don't want these in DB
  for (let key in items) {
    if (key.startsWith("_")) {
      delete items[key];
    }
  }

  for (let column in items) {
    columns.push(`${column}=$${idx}`);//here's where we make it a string.
    idx += 1;
  }

  // build query
  let cols = columns.join(", ");
  let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;//so right here, the string could be UPDATE users SET first_name=$1 WHERE username=$2 RETURNING *


  let values = Object.values(items);//then here, we array the items. 'ted123', 'Ted'
  values.push(id);//push in the id last so as to set it as WHERE conditional,[ 'Jimmy', 'jim' ]
  return { query, values };
}

module.exports = sqlForPartialUpdate;
