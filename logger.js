const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Уровень логирования (info, error, debug и т.д.)
  format: winston.format.combine(
    winston.format.timestamp(), // Добавляем временную метку
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`; // Формат сообщения
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'all.log' }), // Запись в файл
    new winston.transports.Console(), // Вывод в консоль (опционально)
  ],
});


module.exports = logger;