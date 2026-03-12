module.exports = (res, error) => {
    const status = error.status || 500
    res.status(status).json({
        success: false,
        message: error.message || "Internal server error"
    })
    
    // res.status(500).json({
    //     success: false,
    //     message: err.message ? err.message : err,
    // });
};
