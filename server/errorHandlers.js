/**
 * Error handlers.
 */
module.exports = {
    /**
     * Logs the caught error to the console and calls the next method.
     *
     * @param {Error} err Error
     * @param {Request} req Request object
     * @param {Response} res Response object
     * @param {Function} next Method for continuing execution
     */
    logErrors(err, req, res, next) {
        console.error(`${err.name} error:`, err);
        next(err);
    },

    /**
     * Tries to identify the type of error and send a response with the apporiate error status code.
     *
     * @param {Error} err Error
     * @param {Request} req Request object
     * @param {Response} res Response object
     * @param {Function} next Method for continuing execution
     */
    clientErrorHandler(err, req, res, next) {
        const statusCode = require('./config').errors[err.name];

        if (typeof statusCode === 'undefined') {
            return next(err);
        } else if (!res.headersSent) {
            res.status(statusCode).json(err);
        }
    },

    /**
     * Checks if the headers have been sent and if not, sends the response.
     *
     * Checks if the error has a status code. Uses 500 if none is found.
     *
     * @param {Error} err Error
     * @param {Request} req Request object
     * @param {Response} res Response object
     * @param {Function} next Method for continuing execution
     */
    errorHandler(err, req, res, next) {
        // TODO: test this http://expressjs.com/en/guide/error-handling.html
        if (res.headersSent) return next(err);

        const status = err.status || 500;

        res.status(status).json({
            message: 'An unexpected error occurred',
            error: err
        });
    }
};
