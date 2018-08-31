'use strict';

const errorUtil = require('error-util');

const filterConstants = require('./constants/filter.json');

const operators = filterConstants.operators;
const conditions = filterConstants.conditions;
const rangeConditions = filterConstants.rangeConditions;
const order = filterConstants.order;

const raw = require('objection').raw;

/**
 * It will sanitize the column and return the proper values to be used in a where clause
 *
 * If 'like' is used as an operator, the column and value are marked as lowercase
 *
 * Regardless of the operator, blank spaces will be removed from the beginning and end of the column
 *
 * @param {string} column - Database column
 * @param {string} operator - Operator to be used
 * @param {string} value - Value to check against
 * @param {number} conditionIndex - Used to construct error message string
 */
function getSanitizedCondtion(column, operator, value, conditionIndex) {
  if (operator === operators.like && typeof value !== 'string') {
    errorUtil.throwInvalidArgumentError(`filter[${conditionIndex}].value`);
  }

  if (operator === operators.like) {
    return [raw(`LOWER(${column.trim()})`), value.toLowerCase()];
  }

  return [column.trim(), value];
}

/**
 * Given the different url parameters that can be passed as filters, this function
 * will determine if the combination used is valid.
 *
 * @param {string} column - Required. column name from the database
 * @param {mixed} value - Required. Could be any value
 * @param {string|null} operator - Optional. URL string passed. If not present, equal will be used
 * @param {string|null} databaseOperator - Required with operator. Operator to be used in the database condition
 * @param {string|null} range - Optional. Range operation to perform. Value must be an array if this is used
 * @param {number} conditionIndex - Used to construct error message string
 *
 * @returns {string|null} String if an invalid filter is found or null if everything is valid
 */
function getInvalidFilterString(column, value, operator, databaseOperator, range, conditionIndex) {
  if (typeof column !== 'string') {
    return `filter[${conditionIndex}].column`;
  }

  if (typeof value === 'undefined') {
    return `filter[${conditionIndex}].value`;
  }

  if (typeof operator !== 'undefined' && typeof databaseOperator === 'undefined') {
    return `filter[${conditionIndex}].operator`;
  }

  if (typeof range !== 'undefined' && !Array.isArray(value)) {
    return `filter[${conditionIndex}].value`;
  }

  return null;
}

/**
 * Public functions
 */
module.exports = {
  /**
   * Appends a select query to the query builder. It assumes the
   * string is comma separated
   *
   * E.g. 'column_one,column_two'
   */
  addSelect: (queryBuilder, selectString) => {
    if (typeof selectString === 'undefined') {
      return queryBuilder;
    }

    if (typeof selectString !== 'string') {
      errorUtil.throwInvalidArgumentError('select');
    }

    // We need at least one column name
    const querySplit = selectString.trim().split(',').filter((column) => (column.length > 0));

    if (querySplit.length === 0) {
      errorUtil.throwInvalidArgumentError('select');
    }

    return queryBuilder.select(selectString.split(','));
  },

  /**
   * Appends additional filters to the query. The filterString should be
   * a valid JSON array containing filter objects
   *
   * Allowed filter keys:
   * - column: the database column name
   * - operator: valid operator as found in the filter.json constants file
   * - value: values to check against
   * - condition: valid condition as found in the filter.json constants file
   * - range: valid range type as found in the filter.json constants file
   *
   * Other notes:
   * - column and value must ALWAYS be defined
   * - column must be a string
   * - condition will be ignored if range is defined. Just use the conditional range if you need to
   */
  addFilter: (queryBuilder, filterString) => {
    if (typeof filterString === 'undefined') {
      return queryBuilder;
    }

    let filters = null;

    try {
      filters = JSON.parse(filterString);
    } catch (error) {
      errorUtil.throwInvalidArgumentError('filter');
    }

    // The parsed json has to be an array
    if (!Array.isArray(filters)) {
      errorUtil.throwInvalidArgumentError('filter');
    }

    for (let index = 0; index < filters.length; index++) {
      const operator = operators[filters[index].operator];
      const condition = conditions[filters[index].condition];
      const range = rangeConditions[filters[index].range];

      // Making sure that column is a string and value is defined
      // Also making sure that if an operator was supplied it is valid
      typeof filters[index].operator !== 'undefined' && typeof operator === 'undefined';

      const filterError = getInvalidFilterString(
        filters[index].column,
          filters[index].value,
          filters[index].operator,
          operator,
          range,
          index
      );

      if (filterError) {
        errorUtil.throwInvalidArgumentError(filterError);
      }

      // Function to append to the query. By default it will be 'where'
      let conditionalFunction = 'where';

      if (typeof range !== 'undefined') {
        conditionalFunction = range;
      } else if (typeof condition !== 'undefined') {
        conditionalFunction = condition;
      }

      const sanitizedValues = getSanitizedCondtion(
        filters[index].column,
        operator,
        filters[index].value,
        index
      );

      if (typeof operator === 'undefined') {
        queryBuilder = queryBuilder[conditionalFunction](sanitizedValues[0], sanitizedValues[1]);
      } else {
        queryBuilder = queryBuilder[conditionalFunction](
          sanitizedValues[0],
          operator,
          sanitizedValues[1]
        );
      }
    }

    return queryBuilder;
  },

  /**
   * Appends an order by to the query builder. If ASC or DESC
   * is not defined, ASC will be default
   *
   * E.g. 'column_one' - Returns ascending order
   * E.g. 'column_one,ASC' or 'column_one,asc' - Returns ascending order
   * E.g. 'column_one,DESC' or 'column_one,desc' - Returns descending order
   */
  addOrderBy: (queryBuilder, orderByString) => {
    if (typeof orderByString === 'undefined') {
      return queryBuilder;
    }

    if (typeof orderByString !== 'string') {
      errorUtil.throwInvalidArgumentError('order');
    }

    // We need at least the column name
    const querySplit = orderByString.split(',');

    if (querySplit.length === 0 || querySplit[0].trim() === '') {
      errorUtil.throwInvalidArgumentError('order');
    }

    // Checking for valid order direction if one was passed
    let orderDirection = order.default;

    if (querySplit.length === 2) {
      orderDirection = querySplit[1].toUpperCase();

      // If the order direction is incorrect, we'll throw an error
      if (orderDirection !== order.asc && orderDirection !== order.desc) {
        errorUtil.throwInvalidArgumentError('order');
      }
    }

    return queryBuilder.orderBy(querySplit[0].trim().toLowerCase(), orderDirection);
  },

  /**
   * Adds pagination to the query builder.
   *
   * If page and pageSize are not defined, the queryBuilder will not be paginated.
   *
   * Both page and pageSize are required to paginate the results
   */
  addPagination: (queryBuilder, page, pageSize) => {
    if (typeof page === 'undefined' && typeof pageSize === 'undefined') {
      return queryBuilder;
    }

    const isPageInvalid = (typeof page !== 'number' && typeof page !== 'string') || page <= 0;
    const isPageSizeInvalid = (typeof pageSize !== 'number' && typeof pageSize !== 'string') || pageSize <= 0;

    if (isPageInvalid || isPageSizeInvalid) {
      errorUtil.throwInvalidArgumentError('pagination');
    }

    // Page - 1 as objection page starts at 0
    return queryBuilder.page(page - 1, pageSize);
  }
};
