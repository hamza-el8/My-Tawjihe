// Input validation middleware using simple schema validation
const validateSchema = (schema) => {
  return (req, res, next) => {
    const error = validateData(req.body, schema);
    if (error) {
      return res.status(400).json({ message: `Validation error: ${error}` });
    }
    next();
  };
};

const validateData = (data, schema) => {
  if (!schema) return null;
  
  for (const field in schema) {
    const rule = schema[field];
    const value = data[field];

    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      return `${field} is required`;
    }

    if (value !== undefined && value !== null) {
      // Check type
      if (rule.type && typeof value !== rule.type) {
        return `${field} must be ${rule.type}`;
      }

      // Check min length
      if (rule.minLength && value.length < rule.minLength) {
        return `${field} must be at least ${rule.minLength} characters`;
      }

      // Check max length
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${field} must be at most ${rule.maxLength} characters`;
      }

      // Check email
      if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return `${field} must be a valid email`;
      }

      // Check pattern/regex
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${field} format is invalid`;
      }

      // Check enum
      if (rule.enum && !rule.enum.includes(value)) {
        return `${field} must be one of: ${rule.enum.join(', ')}`;
      }
    }
  }

  return null;
};

module.exports = { validateSchema, validateData };
