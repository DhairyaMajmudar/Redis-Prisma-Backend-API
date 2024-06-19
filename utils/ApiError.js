class ApiError extends Error {
    constructor(statusCode, message = 'Something went wrong', error = [], stack = '') {
        super(message)
        this.statusCode = statusCode;
        this.data = null
        this.message = message;
        this.success = false;
        this.errors = error;

        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }

// thoda samajhna hoga yeh kya hai aur agar lage optionally remove kar sakte hai toh kardena.