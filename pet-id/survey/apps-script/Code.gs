/**
 * Pet ID — приём ответов опроса в Google Таблицу.
 *
 * Скрипт привязан к таблице (Расширения → Apps Script) и публикуется
 * как веб-приложение. Страница опроса отправляет сюда POST с JSON:
 *   { submittedAt: "...", answers: { q1: "...", ..., q16: "..." } }
 * Каждый ответ добавляется новой строкой на лист «Ответы».
 */

const SHEET_NAME = 'Ответы';
const TIME_ZONE = 'Europe/Moscow';
const MAX_CELL_LENGTH = 3000;

// Порядок и заголовки колонок. Ключи совпадают с полями на странице опроса.
const COLUMNS = [
  ['q1', '1. Сколько у вас собак?'],
  ['q2', '2. Сколько лет вашей собаке?'],
  ['q3', '3. Как часто вы гуляете с собакой?'],
  ['q4', '4. Сколько в среднем длится одна прогулка?'],
  ['q5', '5. Используете ли приложение/устройство для отслеживания?'],
  ['q6', '6. Что полезно иметь в одном приложении (до 5)'],
  ['q7', '7. Что неудобно в уходе за собакой'],
  ['q8', '8. Что заставит открывать приложение регулярно'],
  ['q9', '9. Что полезно во время прогулки'],
  ['q10', '10. Важность знать, где собака (1–5)'],
  ['q11', '11. Функции при потере собаки (до 3)'],
  ['q12', '12. Цифровой паспорт'],
  ['q13', '13. Полезные уведомления'],
  ['q14', '14. За что готовы платить'],
  ['q15', '15. Приемлемая подписка в месяц'],
  ['q16', '16. Что должно быть, чтобы не удалить приложение'],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const answers = (data && data.answers) || {};

    const sheet = getSheet_();
    const row = [Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss')];
    COLUMNS.forEach(function (col) {
      let value = answers[col[0]];
      value = value == null ? '' : String(value).slice(0, MAX_CELL_LENGTH);
      // Защита от формул: значения, начинающиеся с = + - @, пишем как текст
      if (/^[=+\-@]/.test(value)) value = "'" + value;
      row.push(value);
    });
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    // Попадает в журнал выполнений Apps Script (Выполнения → строка → журнал)
    console.error('Не удалось записать ответ: ' + err + '\nДанные: ' + (e && e.postData ? e.postData.contents : ''));
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Открыв адрес веб-приложения в браузере, можно проверить, что оно работает.
function doGet() {
  return json_({ ok: true, message: 'Pet ID survey endpoint is running' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    const header = ['Дата и время (МСК)'].concat(COLUMNS.map(function (c) { return c[1]; }));
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold').setWrap(true);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
