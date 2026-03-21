const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ${err.stack || err.message}`);

    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    if (err.code === 11000) {
        return res.status(409).json({ error: 'Duplicate entry' });
    }

    const status = err.statusCode || 500;
    res.status(status).json({
        error: status === 500 ? 'Internal server error' : err.message,
    });
};

module.exports = { errorHandler };
