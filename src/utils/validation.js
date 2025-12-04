import validator from 'validator';

export function validateEmail (email) {
    return validator.isEmail(email);
}

export function validateUrl(url) {
  return validator.isURL(url, {
    protocols: ["http", "https"],
    require_protocol: true,
  });
}
