//this func takes a func (fn) as a parameter which takes req,res and next as parameter and executes the fn func with same parameter

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    };
}

// module.exports="wrapAsync";
module.exports=wrapAsync;

