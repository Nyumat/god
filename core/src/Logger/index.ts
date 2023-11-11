const LCERROR = '\x1b[31m%s\x1b[0m'; //red
const LCWARN = '\x1b[33m%s\x1b[0m'; //yellow
const LCINFO = '\x1b[36m%s\x1b[0m'; //cyan
const LCSUCCESS = '\x1b[32m%s\x1b[0m'; //green

type LoggerType = {
    error: (message: string, ...optionalParams: any[]) => void;
    warn: (message: string, ...optionalParams: any[]) => void;
    info: (message: string, ...optionalParams: any[]) => void;
    success: (message: string, ...optionalParams: any[]) => void;
};

const logger: LoggerType = {
    error: (message: string, ...optionalParams: any[]) => {
        console.error(LCERROR, message, ...optionalParams);
    },
    warn: (message: string, ...optionalParams: any[]) => {
        console.warn(LCWARN, message, ...optionalParams);
    },
    info: (message: string, ...optionalParams: any[]) => {
        console.info(LCINFO, message, ...optionalParams);
    },
    success: (message: string, ...optionalParams: any[]) => {
        console.info(LCSUCCESS, message, ...optionalParams);
    },
};

/*

// then instead (as presented in the accepted answer)
// console.error(LCERROR, 'Error message in red.');
// you write:

logger.error('Error message in red.');

// or with multiple parameters (only the message will be red):

logger.error('Error message in red.', 1, false, null, {someKey: 'whatever'});

// or use backticks (template literal) instead multiple params:

logger.error(`This will be red as ${foo} and ${bar} too.`);

*/

export default logger;