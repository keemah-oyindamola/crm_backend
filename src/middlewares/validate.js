const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));

      return res.status(400).json({ message: "Validation failed", errors });
    }

    req.body = result.data; // cleaned/validated data
    next();
  };
};

module.exports = validate;