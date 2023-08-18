// Import the Chromium browser into our scraper.
import { configDotenv } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { chromium } from 'playwright';
configDotenv();
const { TELEGRAM_BOT_TOKEN, NOT_HEADLESS, TELEGRAM_CHAT_ID } = process.env;

const browser = await chromium.launch({
	headless: NOT_HEADLESS != 1,
});

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// Open a new page / tab in the browser.
const page = await browser.newPage();

// Tell the tab to navigate to the JavaScript topic page.
await page.goto(
	'https://especiales.tiendabna.com.ar/catalog/promo-argentina-programa'
);
await page.waitForTimeout(10000);
const textContent = await page.textContent('app-catalog');
console.log('Contenido de la página en texto: "' + textContent + '"');
let message = '';
let disable_notification = true;
if (textContent.length > 0) {
	disable_notification = false;
	message =
		'Parece haber noticias en el bna:\n' +
		textContent +
		'\nhttps://especiales.tiendabna.com.ar/catalog/promo-argentina-programa';
} else {
	message = 'No hay novedades en el bna';
}
await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
	disable_notification: disable_notification,
});
// Pause for 10 seconds, to see what's going on.
// await page.waitForTimeout(10000);

// Turn off the browser to clean up after ourselves.
await browser.close();
