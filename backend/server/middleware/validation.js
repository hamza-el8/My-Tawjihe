// Validation middleware — enforces schemas defined in schemas.js
const validateSchema = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    const missing = value === undefined || value === null || value === '';

    if (rules.required && missing) {
      errors.push({ field, message: `${field} est requis` });
      continue;
    }

    if (missing) continue; // optional field not provided — skip further checks

    // Type check
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push({ field, message: `${field} doit être une chaîne de caractères` });
      continue;
    }
    if (rules.type === 'number' && (isNaN(Number(value)))) {
      errors.push({ field, message: `${field} doit être un nombre` });
      continue;
    }

    // String-specific checks
    if (typeof value === 'string') {
      if (rules.minLength && value.trim().length < rules.minLength) {
        errors.push({ field, message: `${field} doit contenir au moins ${rules.minLength} caractères` });
      }

      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({ field, message: `${field} doit être une adresse email valide` });
        }
      }

      // Enum enforcement
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} doit être l'une des valeurs suivantes: ${rules.enum.join(', ')}` });
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Données invalides', errors });
  }

  next();
};

module.exports = { validateSchema };
