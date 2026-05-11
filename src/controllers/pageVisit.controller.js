const { PageVisit } = require('../models');

async function registerPageVisit(req, res) {
  try {
    const { page_key } = req.body;

    if (!page_key || !page_key.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'El page_key es obligatorio.',
      });
    }

    let pageVisit = await PageVisit.findOne({
      where: { page_key: page_key.trim() },
    });

    if (!pageVisit) {
      pageVisit = await PageVisit.create({
        page_key: page_key.trim(),
        total_visits: 1,
        last_visit_at: new Date(),
      });
    } else {
      await pageVisit.update({
        total_visits: Number(pageVisit.total_visits) + 1,
        last_visit_at: new Date(),
        updated_at: new Date(),
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Visita registrada correctamente.',
      data: {
        page_key: pageVisit.page_key,
        total_visits: pageVisit.total_visits,
        last_visit_at: pageVisit.last_visit_at,
      },
    });
  } catch (error) {
    console.error('ERROR REGISTER PAGE VISIT:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar visita de pagina.',
      error: error.message,
    });
  }
}

async function getPageVisit(req, res) {
  try {
    const { page_key } = req.params;

    const pageVisit = await PageVisit.findOne({
      where: { page_key },
    });

    if (!pageVisit) {
      return res.status(200).json({
        ok: true,
        data: {
          page_key,
          total_visits: 0,
          last_visit_at: null,
        },
      });
    }

    return res.status(200).json({
      ok: true,
      data: pageVisit,
    });
  } catch (error) {
    console.error('ERROR GET PAGE VISIT:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener contador de pagina.',
      error: error.message,
    });
  }
}

async function getAllPageVisits(req, res) {
  try {
    const visits = await PageVisit.findAll({
      order: [['total_visits', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      total_registros: visits.length,
      data: visits,
    });
  } catch (error) {
    console.error('ERROR GET ALL PAGE VISITS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar visitas de paginas.',
      error: error.message,
    });
  }
}

module.exports = {
  registerPageVisit,
  getPageVisit,
  getAllPageVisits,
};