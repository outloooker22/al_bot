require('dotenv').config()

const fs = require('fs');
const path = require('path');

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const logger = require('./logger'); // Подключаем логгер

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => {
    var replyMessage = `
О, привет - привет!
Я нахожусь в разработке, но можешь быть уверен, я выполняюсь на Raspberry Pi 3B+ прямо у создателя дома! Я совсем недавно появилась, но уже умею хорошо слушать, /start и /log
версия бота от 8.11.2024`
    ctx.reply(replyMessage)
    logger.info('User started the bot. Reply:' + replyMessage); // Логируем событие
});

bot.command('log', (ctx) => {
    const logFilePath = path.join(__dirname, 'all.log');  // Путь к файлу лога
  
    fs.readFile(logFilePath, 'utf-8', (err, data) => {
      if (err) {
        logger.error(`Error reading log file: ${err.message}`);
        return ctx.reply('Error reading logs.');
      }
  
      const lines = data.trim().split('\n');
      const lastLines = lines.slice(-5); // Последние 5 строк
  
      // отправляем в чат, учитывая ограничение на 4096 символов
      const message = lastLines.join('\n');
      if (message.length <= 4096) {
        ctx.replyWithHTML(`<code>${message}</code>`, { parse_mode: 'HTML' });
      }
      else {
        // делим на куски по 4096 символов
        for (let i = 0; i < message.length; i += 4096) {
          ctx.replyWithHTML(`<code>${message.substring(i, i + 4096)}</code>`, { parse_mode: 'HTML' });
        }
      }
    });
  
  });


bot.on(message('sticker'), (ctx) => {
    ctx.reply('Сам то понял что сказал? 0_о');
    logger.info('User sent a sticker');
});

bot.on('message', (ctx) => {
    const messageText = ctx.message.text;
    const userId = ctx.message.from.id;
    const userName = ctx.message.from.username || ctx.message.from.first_name;
    logger.info(`User ${userName} (${userId}) sent a message: ${messageText}`);

     ctx.reply(`Мммм \nя ещё не понимаю тебя, но я всё записала и обязательно разберусь!`);
});


bot.launch()
.then(() => {
    logger.info('Bot started successfully.');
})
.catch((error) => {
    logger.error(`Error starting bot: ${error.message}`);
    console.error(`Error starting bot: ${error}`); // Вывод ошибки в консоль для отладки
    process.exit(1); // Завершить процесс с кодом ошибки
});
