const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                if (res && !res.headersSent) {
                    res.status(err?.statusCode || 500).json({
                        success: false,
                        message: err?.message || "Something went wrong"
                    });
                }
            });
    };
};

export { asyncHandler };
