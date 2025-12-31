//similar to OOPS
//ExpressError class inherits from class Error
//class Error is builtin but ExpressError is custom

class ExpressError extends Error{
    constructor(statusCode,message){
        super();//call super class
        this.statusCode=statusCode;
        this.message=message;
    }
}

module.exports=ExpressError;