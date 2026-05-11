const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
}

function isStrongPassword(password) {
  // Minimo 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

  return regex.test(password);
}

module.exports = {
  hashPassword,
  comparePassword,
  isStrongPassword,
};