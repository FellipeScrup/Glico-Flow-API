const User = require('../models/User');
const Measurement = require('../models/Measurement');
const PDFDocument = require('pdfkit');

exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    // Converter as datas considerando o fuso horário
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log('Data início:', start);
    console.log('Data fim:', end);

    const measurements = await Measurement.find({
      user: userId,
      recordedAt: {
        $gte: start,
        $lte: end
      }
    }).sort({ recordedAt: -1 });

    console.log('Número de medições encontradas:', measurements.length);

    // Calcular estatísticas
    const values = measurements.map(m => m.glycemiaValue);
    
    const media = values.length ? 
      values.reduce((a, b) => a + b, 0) / values.length : 0;
    
    // Desvio padrão
    const desvioPadrao = values.length ? 
      Math.sqrt(values.reduce((a, b) => a + Math.pow(b - media, 2), 0) / values.length) : 0;

    // HbA1c estimada (fórmula: (média + 46.7) / 28.7)
    const hba1cEstimada = (media + 46.7) / 28.7;

    // Percentuais por faixa
    const totalMedicoes = values.length;
    const hipos = values.filter(v => v < 70).length;
    const hipers = values.filter(v => v > 180).length;
    const alvos = values.filter(v => v >= 70 && v <= 180).length;

    // Médias por período - com verificação de segurança
    const jejumValues = measurements
      .filter(m => m.measurementTime && m.measurementTime.toLowerCase() === 'jejum')
      .map(m => m.glycemiaValue);
    
    const preValues = measurements
      .filter(m => m.measurementTime && m.measurementTime.toLowerCase().includes('pre'))
      .map(m => m.glycemiaValue);
    
    const posValues = measurements
      .filter(m => m.measurementTime && m.measurementTime.toLowerCase().includes('pos'))
      .map(m => m.glycemiaValue);

    const estatisticas = {
      media: media || 0,
      desvioPadrao: desvioPadrao || 0,
      hba1cEstimada: hba1cEstimada || 0,
      percentualHipo: totalMedicoes ? (hipos / totalMedicoes) * 100 : 0,
      percentualAlvo: totalMedicoes ? (alvos / totalMedicoes) * 100 : 0,
      percentualHiper: totalMedicoes ? (hipers / totalMedicoes) * 100 : 0,
      mediaJejum: jejumValues.length ? 
        jejumValues.reduce((a, b) => a + b, 0) / jejumValues.length : 0,
      mediaPre: preValues.length ? 
        preValues.reduce((a, b) => a + b, 0) / preValues.length : 0,
      mediaPos: posValues.length ? 
        posValues.reduce((a, b) => a + b, 0) / posValues.length : 0,
      // Adicionar contagens
      countJejum: jejumValues.length,
      countPre: preValues.length,
      countPos: posValues.length
    };

    res.json({
      medicoes: measurements,
      estatisticas
    });
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ 
      message: 'Erro ao gerar relatório',
      error: error.message 
    });
  }
}; 