import validator from 'validator';

export function isValidEmail (email) {
    return validator.isEmail(email);
}

export function isValidUrl(url) {
  return validator.isURL(url, {
    protocols: ["http", "https"],
    require_protocol: true,
  });
}
