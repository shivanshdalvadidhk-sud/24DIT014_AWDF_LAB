const errorHandler = (err, req, res, next) => {

    console.error(err);

    // Handle Mongoose Validation Errors
    if (err.name === "ValidationError") {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

    // Handle Invalid MongoDB ObjectId
    if (err.name === "CastError") {

        return res.status(404).json({

            success: false,

            message: "Task not found"

        });

    }

    res.status(500).json({

        success: false,

        message: "Internal Server Error"

    });

};

module.exports = errorHandler;