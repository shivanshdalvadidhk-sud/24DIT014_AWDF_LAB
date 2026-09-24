const validateTaskInput = (req, res, next) => {
    const { title, priority } = req.body;

    // Check required title on POST
    if (req.method === "POST") {
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Validation Error: Title is required and cannot be empty."
            });
        }
    }

    // Check non-empty title if provided on PUT
    if (req.method === "PUT" && title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Validation Error: Title cannot be empty."
            });
        }
    }

    // Validate priority enum if provided
    if (priority !== undefined) {
        const allowedPriorities = ["low", "medium", "high"];
        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Validation Error: Priority must be one of 'low', 'medium', or 'high'."
            });
        }
    }

    next();
};

module.exports = validateTaskInput;
