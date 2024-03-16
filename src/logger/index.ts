const level = require('./config/level');
// const logger = require('./logger');
import logger from "./logger";

/**
 * exported functions
 * warn, info, error, debug
 */
const exportObject = {
  info: logger.bind(null, level.info),
  warn: logger.bind(null, level.warn),
  debug: logger.bind(null, level.debug),
  error: logger.bind(null, level.error),
};


export = exportObject
// export default exportObject
