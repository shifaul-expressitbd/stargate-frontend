
type ValidatorResult = {
  error: string
  warning: string
}

type ValidatorFunction = (
  // value: string | number | boolean | File | undefined | Date,
  // ...args: (string | undefined)[]
  value: unknown,
  ...args: unknown[]
) => ValidatorResult
export const validateDeliveryCost: ValidatorFunction = (value) => {
  const result: ValidatorResult = { error: '', warning: '' }

  if (typeof value !== 'string') {
    result.error = 'Delivery cost is required.'
    return result
  }

  if (!value.trim()) {
    result.error = 'Delivery cost is required.'
  } else if (isNaN(Number(value)) || Number(value) < 0) {
    result.error = 'Must be a positive number.'
  } else if (Number(value) === 0) {
    result.warning = 'Free delivery may affect profitability.'
  }

  return result
}


export const Validators: Record<string, ValidatorFunction> = {
  name: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string') {
      result.error = 'Full name is required.'
      return result
    }

    if (!value.trim()) {
      result.error = 'Full name is required.'
    } else if (!/^[A-Za-z\s]+$/.test(value)) {
      result.error = 'Only uppercase, lowercase and space allowed.'
    } else if (value.length > 50) {
      result.warning = 'Long names might be truncated in some systems.'
    }

    return result
  },

  username: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }
    if (typeof value !== 'string') {
      result.error = 'User name is required.'
      return result
    }
    if (!value.trim()) {
      result.error = 'User name is required.'
    }
    return result
  },

  containerName: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string') {
      result.error = 'Container name is required.'
      return result
    }
    if (!value.trim()) {
      result.error = 'Container name is required.'
    } else if (value.length > 5 && value.length > 200) {
      result.error = 'Container names must be (5-200) characters'
    }

    return result
  },


  email: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string') {
      result.error = 'Email is required.'
      return result
    }

    if (!value.trim()) {
      result.error = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      result.error = 'Invalid email format'
    } else if (
      !value.endsWith('@gmail.com') &&
      !value.endsWith('@yahoo.com') &&
      !value.endsWith('@outlook.com')
    ) {
      result.error = 'This email domain is not supported'
      // result.error =
      //   'This email domain is not supported. Please use a valid email like @gmail.com @outlook.com @yahoo.com @icloud.com or @hotmail.com'
    }

    return result
  },

  businessEmail: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string') {
      result.error = 'Email is required.'
      return result
    }

    if (!value.trim()) {
      result.error = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      result.error = 'Invalid email format'
    }

    return result
  },

  phone: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string') {
      result.error = 'Phone is required'
      return result
    }

    if (!value.trim()) {
      result.error = 'Phone is required'
    } else if (value.length !== 11) {
      result.error = 'Phone number must be exactly 11 digits.'
    } else if (!/^[0-9]+$/.test(value)) {
      result.error = 'Phone number can only contain numbers.'
    } else if (!value.startsWith('01')) {
      result.error = 'Phone number must start with 01.'
    }

    return result
  },

  password: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string') {
      result.error = 'Password is required.'
      return result
    }

    if (!value) {
      result.error = 'Password is required.'
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/.test(value)
    ) {
      result.error =
        '8-20 characters with uppercase, lowercase, number, and special character.'
    } else if (value.length === 8) {
      result.warning =
        'For better security, consider a longer password (12+ characters).'
    }

    return result
  },

  confirmPassword: (value: unknown, password: unknown): ValidatorResult => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string' || !value.trim()) {
      result.error = 'Confirm password is required.'
      return result
    }

    if (typeof password !== 'string' || !password.trim()) {
      result.error = 'Password verification failed.'
      return result
    }

    if (value !== password) {
      result.error = "Passwords don't match."
    }

    return result
  },

  location: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }
    if (typeof value !== 'string') {
      result.error = 'Address is required.'
      return result
    }
    if (!value.trim()) {
      result.error = 'Address is required.'
    } else if (value.length < 3 || value.length > 120) {
      result.error = 'Address must be between 5-120 characters.'
    } else if (value.length > 50) {
      result.warning = 'Very long addresses might be difficult to verify.'
    }
    return result
  },

  website: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string') return result

    if (
      value &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)
    ) {
      result.error = 'Invalid website URL.'
    } else if (value && !value.startsWith('https://')) {
      result.warning = 'For security, consider using HTTPS for your website.'
    }

    return result
  },

  credential: (value) => {
    const result: ValidatorResult = { error: '', warning: '' }

    if (typeof value !== 'string') {
      result.error = 'Email or phone is required.'
      return result
    }

    if (!value.trim()) {
      result.error = 'Email or phone is required.'
    }

    return result
  },
}

export const mapValidationErrors = (
  errorArray: { path: string; message: string }[]
): Record<string, string> => {
  return errorArray.reduce((acc, err) => {
    acc[err.path] = err.message
    return acc
  }, {} as Record<string, string>)
}

// =========================
// Updated Usage Example
// =========================
/*
import { Validators } from './validationUtils';

const validateForm = (formData: Record<string, any>) => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  Object.keys(formData).forEach((key) => {
    const validationResult = Validators[key]?.(formData[key], formData.password);
    if (validationResult?.error) errors[key] = validationResult.error;
    if (validationResult?.warning) warnings[key] = validationResult.warning;
  });

  setErrors(errors);
  setWarnings(warnings);
  return Object.keys(errors).length === 0;
};
*/
