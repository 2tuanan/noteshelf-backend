const { ZodError } = require('zod');

const getValueAtPath = (source, path) => path.reduce((current, key) => {
  if (current == null) {
    return undefined;
  }

  return current[key];
}, source);

const validate = (schema, target = 'body') => (req, res, next) => {
  try {
    schema.parse(req[target]);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues || error.errors || [];

      return res.status(400).json({
        error: 'Validation failed',
        details: issues.map((entry) => ({
          field: entry.path.join('.'),
          message: entry.code === 'invalid_type' && getValueAtPath(req[target], entry.path) === undefined
            ? 'Required'
            : entry.message,
        })),
      });
    }

    return next(error);
  }
};

module.exports = { validate };
