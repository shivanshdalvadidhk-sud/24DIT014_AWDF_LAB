const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        statusCode: 404
    });
};

module.exports = notFound;