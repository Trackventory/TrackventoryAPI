const isValidPhone = (phone) => {
  const phoneRegex = /^(?:\+234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const isValidRole = (role) => {
  const validRoles = ['Admin', 'Sales Person', 'Manager'];
  return role && validRoles.includes(role.trim());
};

module.exports = {
  isValidPhone,
  isValidEmail,
  isValidPassword,
  isValidRole
};