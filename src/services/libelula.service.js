const axios = require('axios');

const LIBELULA_BASE_URL = process.env.LIBELULA_BASE_URL;
const LIBELULA_APPKEY = process.env.LIBELULA_APPKEY;
const LIBELULA_CALLBACK_URL = process.env.LIBELULA_CALLBACK_URL;
const LIBELULA_MONEDA = process.env.LIBELULA_MONEDA || 'BOB';

async function registrarDeudaLibelula(payload) {
  try {
    const url = `${LIBELULA_BASE_URL}/rest/deuda/registrar`;

    const body = {
      appkey: LIBELULA_APPKEY,
      moneda: LIBELULA_MONEDA,
      callback_url: LIBELULA_CALLBACK_URL,
      ...payload,
    };

    console.log('URL LIBELULA:', url);
    console.log('BODY LIBELULA REGISTRAR:', body);

    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error(
      'ERROR REGISTRAR DEUDA LIBELULA:',
      error?.response?.data || error.message
    );

    throw {
      message: 'Error al registrar deuda en Libelula.',
      detail: error?.response?.data || error.message,
    };
  }
}

async function consultarDeudaLibelula(payload) {
  try {
    const url = `${LIBELULA_BASE_URL}/rest/deuda/consultar`;

    const body = {
      appkey: LIBELULA_APPKEY,
      ...payload,
    };

    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error(
      'ERROR CONSULTAR DEUDA LIBELULA:',
      error?.response?.data || error.message
    );

    throw {
      message: 'Error al consultar deuda en Libelula.',
      detail: error?.response?.data || error.message,
    };
  }
}

module.exports = {
  registrarDeudaLibelula,
  consultarDeudaLibelula,
};