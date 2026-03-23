const errorHandler = (err, req, res, next) => {
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    console.error(`[${new Date().toISOString()}] ${err.stack || err.message}`);

    if (err.code === 11000) {
        return res.status(409).json({ error: 'Duplicate entry' });
    }

    const status = err.statusCode || 500;
    res.status(status).json({
        error: status === 500 ? 'Internal server error' : err.message,
    });
};

module.exports = { errorHandler };
