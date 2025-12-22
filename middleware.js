const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

// validate listing
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(
            400,
            error.details.map(el => el.message).join(",")
        );
    }
    next();
};

// validate review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(
            400,
            error.details.map(e => e.message).join(",")
        );
    }
    next();
};
