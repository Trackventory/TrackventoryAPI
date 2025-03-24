const paginationMiddleware = (model) => async (req, res, next) => {
    try {
        const pageNumber = parseInt(req.query.page) || 1;
        const limitNumber = parseInt(req.query.limit) || 10;

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({
                status: 'fail',
                message: 'Page and limit must be positive numbers.'
            });
        }

        const skip = (pageNumber - 1) * limitNumber; 

        const results = await model.find().skip(skip).limit(limitNumber);
        const totalCount = await model.countDocuments();

        const totalPages = Math.ceil(totalCount / limitNumber);

        res.paginatedResults = {
            status: 'success',
            currentPage: pageNumber,
            totalPages,
            totalItems: totalCount,
            next: pageNumber < totalPages ? `/products?page=${pageNumber + 1}&limit=${limitNumber}` : null,
            previous: pageNumber > 1 ? `/products?page=${pageNumber - 1}&limit=${limitNumber}` : null,
            data: results
        };

        next();

    } catch (error) {
        console.error('Error in paginationMiddleware:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
}


module.exports = { paginationMiddleware };