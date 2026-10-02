/**
 * Pet ID — аналитика ответов опроса.
 *
 * - buildAnalytics()  пересчитывает лист «Аналитика» (таблицы, срезы, графики).
 *                     Запускается триггером раз в час и из меню «Pet ID».
 * - setupAnalytics()  запустить один раз вручную: включает часовой триггер,
 *                     создаёт секретный ключ для еженедельного отчёта и строит лист.
 * - reportResponse_() текстовая сводка для еженедельного отчёта Claude.
 *                     Отдаётся по адресу веб-приложения с параметром ?key=<REPORT_KEY>.
 *
 * Учитываются только настоящие ответы: строки, где в вопросе 1 выбран
 * один из вариантов (тестовые строки отбрасываются автоматически).
 */

const ANALYTICS_SHEET = 'Аналитика';
const OTHER_OPTION = 'Другое';
const REPORT_OPEN_ANSWERS_LIMIT = 150;   // сколько последних открытых ответов отдавать в сводку
const REPORT_OPEN_ANSWER_MAX_CHARS = 400;

// Вопросы и варианты — те же, что на странице опроса (pet-id/survey/index.html).
const QUESTIONS_META = [
  {"id":1,"type":"single","text":"Сколько у вас собак?","options":["1","2","3 и более"]},
  {"id":2,"type":"multi","text":"Сколько лет вашей собаке?","options":["Меньше 1 года","1–3 года","4–7 лет","8 лет и старше"]},
  {"id":3,"type":"single","text":"Как часто вы гуляете с собакой?","options":["1 раз в день","2 раза в день","3 и более раз в день","Нерегулярно"]},
  {"id":4,"type":"single","text":"Сколько в среднем длится одна прогулка?","options":["Меньше 15 минут","15–30 минут","30–60 минут","Более 60 минут"]},
  {"id":5,"type":"single","text":"Используете ли вы сейчас приложение или устройство для отслеживания активности или местоположения собаки?","options":["Нет","Да, приложение","Да, GPS-трекер","Да, Apple AirTag","Другое"]},
  {"id":6,"type":"multi","text":"Что из этого было бы полезно иметь в одном приложении?","options":["GPS / местоположение в реальном времени","История прогулок и маршрутов","Активность и физическая нагрузка","Цифровой паспорт здоровья","Напоминания о вакцинации и обработках","Напоминания о лекарствах","Карта ветеринарных клиник","Карта зоомагазинов и ветаптек","Собачьи площадки и места для прогулок","Гостиницы / передержки для животных","События для владельцев собак","Помощь при потере собаки","Доступ для членов семьи","Игры / достижения / челленджи","Телемедицина","Страхование питомца","Возможность общаться с другими пользователями приложения","Другое"]},
  {"id":7,"type":"multi","text":"Что сегодня больше всего неудобно в уходе за собакой?","options":["Следить за здоровьем и вакцинациями","Не забывать о лекарствах и обработках","Контролировать активность и прогулки","Понимать, достаточно ли собака двигается","Следить за местоположением","Хранить документы и медицинскую информацию","Быстро находить нужные места и сервисы","Искать передержку / гостиницу","Организовывать поездки с собакой","Находить мероприятия","Другое"]},
  {"id":8,"type":"multi","text":"Что заставило бы вас открывать приложение регулярно?","options":["Возможность увидеть, где находится собака","Статистика прогулок","Активность и здоровье","Полезные рекомендации","Достижения и личные рекорды","Новые маршруты для прогулок","Сравнение показателей","Напоминания о здоровье","Полезные места рядом","Челленджи","Скидки и бонусы","События","Другое"]},
  {"id":9,"type":"multi","text":"Что было бы наиболее полезно для вас непосредственно во время прогулки?","options":["Отслеживание местоположения","Запись маршрута","Расстояние и время прогулки","Контроль активности","Безопасная зона / уведомление при выходе из неё","Поиск ближайшего ветеринара","Поиск dog-friendly мест","Новые маршруты","Другое"]},
  {"id":10,"type":"scale","text":"Насколько для вас важно знать, где находится собака, когда она гуляет без вас?","min":1,"max":5},
  {"id":11,"type":"multi","text":"Если собака потеряется, какие функции были бы для вас наиболее полезны?","options":["Быстрое включение режима «Собака потерялась»","GPS / последняя известная точка","Уведомление людей поблизости","QR-код на ошейнике","Публичный профиль собаки с контактами владельца","Возможность сообщить о найденной собаке","Карта местонахождений / сообщений","Другое"]},
  {"id":12,"type":"single","text":"Хотели бы вы хранить всю информацию о собаке в одном цифровом паспорте?","options":["Да","Скорее да","Скорее нет","Нет"]},
  {"id":13,"type":"multi","text":"Какие уведомления были бы действительно полезны для вас?","options":["Пора на прогулку","Собака гуляла меньше обычного","Достигнута дневная цель активности","Новый личный рекорд","Серия дней без пропусков","Собака вышла из безопасной зоны","Напоминание о вакцинации / обработке","Новое dog-friendly место рядом","Новое мероприятие рядом","Новый челлендж","Никакие"]},
  {"id":14,"type":"multi","text":"За какие функции вы потенциально готовы платить?","options":["GPS-отслеживание","Расширенная аналитика активности","Расширенный цифровой паспорт","Медицинские функции","Аналитика здоровья","Страхование питомца","Расширенный режим поиска потерянной собаки","Семейный аккаунт","Премиум-игры / челленджи","Полная подписка на приложение","Ни за какие","Другое"]},
  {"id":15,"type":"single","text":"Какая стоимость подписки в месяц кажется вам приемлемой?","options":["Бесплатно","До 199 ₽","200–399 ₽","400–699 ₽","700 ₽ и выше","Предпочитаю разовую покупку"]},
  {"id":16,"type":"text","text":"Представьте, что вы пользуетесь нашим приложением через 6 месяцев. Что должно в нём быть, чтобы вы не удалили его?"}
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Pet ID')
    .addItem('Обновить аналитику', 'buildAnalytics')
    .addToUi();
}

function setupAnalytics() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'buildAnalytics'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('buildAnalytics').timeBased().everyHours(1).create();

  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('REPORT_KEY')) {
    props.setProperty('REPORT_KEY', Utilities.getUuid().replace(/-/g, ''));
  }
  buildAnalytics();
  console.log('Триггер включён. REPORT_KEY: ' + props.getProperty('REPORT_KEY'));
}

/* ---------- Чтение и разбор ответов ---------- */

function loadResponses_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, QUESTIONS_META.length + 1).getValues();
  const q1Options = QUESTIONS_META[0].options;
  const rows = [];
  values.forEach(function (v) {
    const answers = {};
    QUESTIONS_META.forEach(function (q, i) { answers[q.id] = String(v[i + 1] == null ? '' : v[i + 1]).trim(); });
    if (q1Options.indexOf(answers[1]) === -1) return; // тестовые и пустые строки
    const date = v[0] instanceof Date ? v[0] : new Date(String(v[0]).replace(' ', 'T') + '+03:00');
    rows.push({ date: date, answers: answers });
  });
  return rows;
}

// Разбирает ответ: какие варианты выбраны и что написано в «Другое».
function parseAnswer_(q, raw) {
  const res = { selected: [], other: '' };
  if (!raw) return res;
  if (q.type === 'scale' || q.type === 'text') { res.selected = [raw]; return res; }
  const parts = q.type === 'multi' ? raw.split('; ') : [raw];
  let inOther = false;
  parts.forEach(function (p) {
    if (inOther) { res.other += '; ' + p; return; } // «Другое» всегда последний вариант
    if (p === OTHER_OPTION) { res.selected.push(OTHER_OPTION); inOther = true; }
    else if (p.indexOf(OTHER_OPTION + ': ') === 0) {
      res.selected.push(OTHER_OPTION); res.other = p.slice(OTHER_OPTION.length + 2); inOther = true;
    } else if (q.options.indexOf(p) !== -1) res.selected.push(p);
  });
  res.other = res.other.replace(/^; /, '').trim();
  return res;
}

// Считает распределение по вопросу для заданного набора ответов.
function questionStats_(q, rows) {
  const st = { q: q, answered: 0, counts: {}, others: [], texts: [], mean: null };
  if (q.options) q.options.forEach(function (o) { st.counts[o] = 0; });
  if (q.type === 'scale') for (let s = q.min; s <= q.max; s++) st.counts[String(s)] = 0;
  let sum = 0;
  rows.forEach(function (r) {
    const raw = r.answers[q.id];
    if (!raw) return;
    st.answered++;
    if (q.type === 'text') { st.texts.push({ date: r.date, text: raw }); return; }
    const p = parseAnswer_(q, raw);
    p.selected.forEach(function (o) { if (st.counts[o] !== undefined) st.counts[o]++; });
    if (p.other) st.others.push(p.other);
    if (q.type === 'scale') sum += Number(raw);
  });
  if (q.type === 'scale' && st.answered) st.mean = sum / st.answered;
  return st;
}

function sortedOptions_(st) {
  return Object.keys(st.counts).sort(function (a, b) {
    if (st.q.type === 'scale' || st.q.id === 15 || st.q.id === 12 || st.q.id <= 4) return 0; // порядковые шкалы — как в опросе
    return st.counts[b] - st.counts[a];
  });
}

function segments_(rows) {
  const byId = {};
  QUESTIONS_META.forEach(function (q) { byId[q.id] = q; });
  return {
    byId: byId,
    gpsImportant: rows.filter(function (r) { return Number(r.answers[10]) >= 4; }),
    alreadyTracking: rows.filter(function (r) { return r.answers[5] && r.answers[5] !== 'Нет'; })
  };
}

function dailyCounts_(rows) {
  const tz = TIME_ZONE;
  const map = {};
  rows.forEach(function (r) {
    const d = Utilities.formatDate(r.date, tz, 'yyyy-MM-dd');
    map[d] = (map[d] || 0) + 1;
  });
  return Object.keys(map).sort().map(function (d) { return [d, map[d]]; });
}

/* ---------- Лист «Аналитика» ---------- */

function buildAnalytics() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rows = loadResponses_();
  let sheet = ss.getSheetByName(ANALYTICS_SHEET);
  if (!sheet) sheet = ss.insertSheet(ANALYTICS_SHEET);
  sheet.getCharts().forEach(function (c) { sheet.removeChart(c); });
  sheet.clear();

  const out = [];       // строки по 3 колонки: A, B, C
  const fmt = [];       // форматы процентов: [row, col, numRows]
  const bold = [];      // жирные строки
  const charts = {};    // id вопроса -> {row, n}
  const push = function (a, b, c) { out.push([safe_(a), b === undefined ? '' : b, c === undefined ? '' : c]); return out.length; };

  const now = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm');
  bold.push(push('Pet ID — аналитика опроса'));
  push('Обновлено (МСК)', now);
  push('Ответов', rows.length);
  push('Пересчитывается автоматически раз в час. Вручную: меню «Pet ID» → «Обновить аналитику».');
  push('');

  if (!rows.length) {
    push('Пока нет ни одного ответа.');
  } else {
    QUESTIONS_META.forEach(function (q) {
      const st = questionStats_(q, rows);
      bold.push(push(q.id + '. ' + q.text));
      if (q.type === 'text') {
        push('Ответили', st.answered);
        push('Последние ответы (полный список — на листе «Ответы»):');
        st.texts.slice(-10).reverse().forEach(function (t) {
          push('— ' + t.text, Utilities.formatDate(t.date, TIME_ZONE, 'dd.MM.yyyy'));
        });
        push('');
        return;
      }
      bold.push(push('Вариант', 'Ответов', '% ответивших'));
      const first = out.length + 1;
      const opts = sortedOptions_(st);
      opts.forEach(function (o) { push(o, st.counts[o], st.answered ? st.counts[o] / st.answered : 0); });
      fmt.push([first, 3, opts.length]);
      charts[q.id] = { row: first - 1, n: opts.length };
      push('Ответили', st.answered);
      if (q.type === 'scale') push('Средняя оценка', Math.round(st.mean * 100) / 100);
      if (st.others.length) push('Свои варианты «Другое»: ' + st.others.join(' | '));
      push('');
    });

    // Срезы
    const seg = segments_(rows);
    bold.push(push('СРЕЗЫ'));
    push('');
    const cross = function (title, qid, segRows, segLabel) {
      const q = seg.byId[qid];
      const all = questionStats_(q, rows);
      const part = questionStats_(q, segRows);
      bold.push(push(title + ' (сегмент: ' + segRows.length + ' чел.)'));
      bold.push(push('Вариант', 'Все респонденты', segLabel));
      const first = out.length + 1;
      const opts = sortedOptions_(all);
      opts.forEach(function (o) {
        push(o, all.answered ? all.counts[o] / all.answered : 0, part.answered ? part.counts[o] / part.answered : 0);
      });
      fmt.push([first, 2, opts.length], [first, 3, opts.length]);
      push('');
    };
    cross('Вопрос 14 — за что готовы платить', 14, seg.gpsImportant, 'Важно знать, где собака (4–5)');
    cross('Вопрос 15 — приемлемая подписка', 15, seg.gpsImportant, 'Важно знать, где собака (4–5)');
    cross('Вопрос 6 — что нужно в приложении', 6, seg.alreadyTracking, 'Уже пользуются трекером/приложением');

    // Динамика — справа
    const daily = dailyCounts_(rows);
    sheet.getRange(1, 5, 1, 2).setValues([['Дата', 'Ответов за день']]).setFontWeight('bold');
    if (daily.length) sheet.getRange(2, 5, daily.length, 2).setValues(daily);
    if (daily.length > 1) {
      sheet.insertChart(sheet.newChart().setChartType(Charts.ChartType.COLUMN)
        .addRange(sheet.getRange(1, 5, daily.length + 1, 2))
        .setPosition(1, 8, 0, 0).setOption('title', 'Ответы по дням')
        .setOption('legend', { position: 'none' }).setOption('width', 520).setOption('height', 260).build());
    }
  }

  sheet.getRange(1, 1, out.length, 3).setValues(out);
  bold.forEach(function (r) { sheet.getRange(r, 1, 1, 3).setFontWeight('bold'); });
  fmt.forEach(function (f) { if (f[2]) sheet.getRange(f[0], f[1], f[2], 1).setNumberFormat('0%'); });
  sheet.setColumnWidth(1, 420).setColumnWidths(2, 2, 150).setColumnWidth(5, 110).setColumnWidth(6, 130);
  sheet.getRange(1, 1, out.length, 1).setWrap(true);
  sheet.setFrozenRows(0);

  // Графики по ключевым вопросам — справа, друг под другом
  let pos = 16;
  [6, 7, 14, 15].forEach(function (qid) {
    const c = charts[qid];
    if (!c) return;
    const q = QUESTIONS_META.filter(function (x) { return x.id === qid; })[0];
    sheet.insertChart(sheet.newChart().setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange(c.row + 1, 1, c.n, 2))
      .setPosition(pos, 8, 0, 0)
      .setOption('title', qid + '. ' + q.text)
      .setOption('legend', { position: 'none' })
      .setOption('width', 620).setOption('height', Math.max(260, 28 * c.n + 80)).build());
    pos += Math.ceil(Math.max(260, 28 * c.n + 80) / 21) + 2;
  });
}

// Свободный текст пользователей не должен превращаться в формулу.
function safe_(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

/* ---------- Сводка для еженедельного отчёта ---------- */

function reportResponse_(key) {
  const expected = PropertiesService.getScriptProperties().getProperty('REPORT_KEY');
  if (!expected || key !== expected) return json_({ ok: false, error: 'forbidden' });
  return ContentService.createTextOutput(buildReportText_()).setMimeType(ContentService.MimeType.TEXT);
}

function buildReportText_() {
  const rows = loadResponses_();
  const pct = function (n, d) { return d ? Math.round((n / d) * 100) + '%' : '—'; };
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const L = [];
  L.push('PET ID — СВОДКА ОПРОСА');
  L.push('Сформировано (МСК): ' + Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm'));
  L.push('Всего ответов: ' + rows.length + '; за последние 7 дней: ' +
    rows.filter(function (r) { return r.date >= weekAgo; }).length);
  L.push('Ответы по дням: ' + dailyCounts_(rows).map(function (d) { return d[0] + ' — ' + d[1]; }).join('; '));
  L.push('');

  QUESTIONS_META.forEach(function (q) {
    if (q.type === 'text') return;
    const st = questionStats_(q, rows);
    L.push('[' + q.id + '] ' + q.text + ' — ответили ' + st.answered +
      (q.type === 'scale' && st.mean !== null ? '; средняя оценка ' + st.mean.toFixed(2) : ''));
    const zero = [];
    sortedOptions_(st).forEach(function (o) {
      if (!st.counts[o] && q.type !== 'scale') { zero.push(o); return; }
      L.push('  ' + o + ': ' + st.counts[o] + ' (' + pct(st.counts[o], st.answered) + ')');
    });
    if (zero.length) L.push('  Не выбрал никто: ' + zero.join('; '));
    if (st.others.length) L.push('  Свои варианты «Другое»: ' + st.others.join(' | '));
    L.push('');
  });

  const seg = segments_(rows);
  const cross = function (title, qid, segRows) {
    const q = seg.byId[qid];
    const all = questionStats_(q, rows), part = questionStats_(q, segRows);
    L.push('СРЕЗ: ' + title + ' (сегмент ' + segRows.length + ' чел.) — вариант: все / сегмент');
    sortedOptions_(all).forEach(function (o) {
      if (!all.counts[o]) return;
      L.push('  ' + o + ': ' + pct(all.counts[o], all.answered) + ' / ' + pct(part.counts[o], part.answered));
    });
    L.push('');
  };
  cross('вопрос 14 у тех, кому важно знать, где собака (оценка 4–5)', 14, seg.gpsImportant);
  cross('вопрос 15 у тех, кому важно знать, где собака (оценка 4–5)', 15, seg.gpsImportant);
  cross('вопрос 6 у тех, кто уже пользуется трекером/приложением', 6, seg.alreadyTracking);

  const open = questionStats_(QUESTIONS_META[QUESTIONS_META.length - 1], rows).texts.slice(-REPORT_OPEN_ANSWERS_LIMIT).reverse();
  L.push('ОТКРЫТЫЕ ОТВЕТЫ НА ВОПРОС 16 (' + open.length + ', новые сверху):');
  open.forEach(function (t) {
    L.push('- ' + Utilities.formatDate(t.date, TIME_ZONE, 'yyyy-MM-dd') + ': ' +
      t.text.replace(/\s+/g, ' ').slice(0, REPORT_OPEN_ANSWER_MAX_CHARS));
  });
  return L.join('\n');
}
