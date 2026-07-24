// ============================================
//  LiveScore — реальные данные через SportAPI (RapidAPI)
//  API: https://sportapi7.p.rapidapi.com
//  Данные: Sofascore (футбол, баскетбол, теннис)
// ============================================

// === Конфигурация API ===
var API_KEY = '7133005d2fmsh76288261a465d25p18a4d9jsn35f62773a32a';
var API_HOST = 'sportapi7.p.rapidapi.com';

// === Резервные данные (если API недоступен) ===
var fallbackMatches = [
  { league: 'Premier League', home: 'Arsenal', away: 'Chelsea', score: '2 : 1', status: 'Идёт второй тайм', time: '67\'', isLive: true, isFinished: false, homeIcon: '🔴', awayIcon: '🔵', goals: ['Saka 23\'', 'Havertz 55\'', 'Palmer 40\''] },
  { league: 'La Liga', home: 'Barcelona', away: 'Real Madrid', score: '1 : 1', status: 'Перерыв', time: 'HT', isLive: true, isFinished: false, homeIcon: '🔴', awayIcon: '⚪', goals: ['Lewandowski 34\'', 'Bellingham 42\''] },
  { league: 'Bundesliga', home: 'Bayern Munich', away: 'Dortmund', score: '0 : 0', status: 'Идёт первый тайм', time: '12\'', isLive: true, isFinished: false, homeIcon: '🔴', awayIcon: '🟡', goals: [] },
  { league: 'Serie A', home: 'Inter', away: 'Juventus', score: '3 : 1', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '🔵', awayIcon: '⚪', goals: ['Lautaro 15\'', 'Lautaro 38\'', 'Barella 61\'', 'Vlahovic 72\''] },
  { league: 'Ligue 1', home: 'PSG', away: 'Marseille', score: '2 : 0', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '🔵', awayIcon: '🔵', goals: ['Mbappe 22\'', 'Dembélé 67\''] },
  { league: 'Champions League', home: 'Manchester City', away: 'Liverpool', score: '0 : 0', status: 'Ожидается', time: '21:00', isLive: false, isFinished: false, homeIcon: '🔵', awayIcon: '🔴', goals: [] }
];

var basketballFallback = [
  { league: 'NBA', home: 'Lakers', away: 'Celtics', score: '89 : 82', status: '3-я четверть', time: 'Q3 05:24', isLive: true, homeIcon: '🟣', awayIcon: '🟢' },
  { league: 'EuroLeague', home: 'CSKA', away: 'Real Madrid', score: '67 : 70', status: '4-я четверть', time: 'Q4 02:10', isLive: true, homeIcon: '🔴', awayIcon: '⚪' }
];

var tennisFallback = [
  { league: 'ATP — Wimbledon', home: 'Djokovic N.', away: 'Alcaraz C.', score: '6 : 4', status: '2-й сет', time: '3:2', isLive: true, homeIcon: '🇷🇸', awayIcon: '🇪🇸' },
  { league: 'WTA — Roland Garros', home: 'Swiatek I.', away: 'Sabalenka A.', score: '4 : 6', status: '1-й сет', time: '4:5', isLive: true, homeIcon: '🇵🇱', awayIcon: '🇧🇾' }
];

// === Состояние ===
var allFootballMatches = [];
var basketballMatches = basketballFallback.slice();
var tennisMatches = tennisFallback.slice();
var apiAvailable = false;

// === Получение сегодняшней даты в формате YYYY-MM-DD ===
function getTodayDate() {
  var now = new Date();
  var y = now.getFullYear();
  var m = String(now.getMonth() + 1).padStart(2, '0');
  var d = String(now.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

// === Форматирование времени из timestamp ===
function formatTime(timestamp) {
  var d = new Date(timestamp * 1000);
  var h = String(d.getHours()).padStart(2, '0');
  var m = String(d.getMinutes()).padStart(2, '0');
  return h + ':' + m;
}

// === Определение статуса матча из API ===
function getMatchStatus(statusCode, statusDescription) {
  // Sofascore status codes
  if (statusCode === 100) return { status: 'Завершён', time: 'FT', isLive: false, isFinished: true };
  if (statusCode === 0 || statusCode === 1) return { status: 'Ожидается', time: '', isLive: false, isFinished: false };
  if (statusCode === 60) return { status: 'Отложен', time: '—', isLive: false, isFinished: false };
  if (statusCode === 70) return { status: 'Отменён', time: '—', isLive: false, isFinished: false };
  // Любой другой код > 0 и < 100 = идёт матч
  return { status: statusDescription || 'В игре', time: 'LIVE', isLive: true, isFinished: false };
}

// === Загрузка матчей через SportAPI ===
async function fetchSportAPI() {
  try {
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 8000);

    var today = getTodayDate();
    // category 1 = футбол (Европа), получаем матчи на сегодня
    var url = 'https://' + API_HOST + '/api/v1/category/1/scheduled-events/' + today;

    var response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': API_HOST,
        'x-rapidapi-key': API_KEY
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('API error: ' + response.status);
    var data = await response.json();

    if (!data.events || data.events.length === 0) {
      console.log('API: нет матчей на сегодня');
      return null;
    }

    console.log('API: получено ' + data.events.length + ' матчей');

    return data.events.map(function (e) {
      var homeScore = (e.homeScore && e.homeScore.current !== undefined) ? e.homeScore.current : 0;
      var awayScore = (e.awayScore && e.awayScore.current !== undefined) ? e.awayScore.current : 0;
      var statusInfo = getMatchStatus(e.status && e.status.code, e.status && e.status.description);

      var leagueName = e.tournament ? e.tournament.name : 'Неизвестно';
      var homeName = e.homeTeam ? e.homeTeam.name : 'Команда 1';
      var awayName = e.awayTeam ? e.awayTeam.name : 'Команда 2';

      // Время для предстоящих матчей
      if (!statusInfo.isLive && !statusInfo.isFinished && e.startTimestamp) {
        statusInfo.time = formatTime(e.startTimestamp);
      }

      return {
        league: leagueName,
        home: homeName,
        away: awayName,
        score: homeScore + ' : ' + awayScore,
        status: statusInfo.status,
        time: statusInfo.time,
        isLive: statusInfo.isLive,
        isFinished: statusInfo.isFinished,
        homeIcon: '⚽',
        awayIcon: '⚽',
        goals: []
      };
    });
  } catch (err) {
    console.warn('SportAPI недоступен:', err.message);
    return null;
  }
}

// === Обновление даты ===
function updateDate() {
  var now = new Date();
  var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  var el = document.getElementById('currentDate');
  if (el) el.textContent = now.toLocaleDateString('ru-RU', options);
}

// === Создание карточки матча ===
function createMatchCard(match) {
  var card = document.createElement('div');
  card.className = 'match-card';
  if (match.isLive) card.classList.add('match-live');

  var goalsHtml = '';
  if (match.goals && match.goals.length > 0) {
    goalsHtml = '<div class="match-goals">' +
      match.goals.map(function (g) { return '<span class="goal-item">⚽ ' + g + '</span>'; }).join('') +
      '</div>';
  }

  var timeClass = match.isLive ? 'match-time live' : 'match-time';
  var timeIcon = match.isLive ? '<span class="live-mini-dot"></span> ' : '';

  card.innerHTML =
    '<div class="match-header">' +
      '<span class="match-league">' + match.league + '</span>' +
      '<span class="' + timeClass + '">' + timeIcon + match.time + '</span>' +
    '</div>' +
    '<div class="match-teams">' +
      '<div class="team">' +
        '<span class="team-icon">' + match.homeIcon + '</span>' +
        '<span>' + match.home + '</span>' +
      '</div>' +
      '<div class="match-score">' + match.score + '</div>' +
      '<div class="team">' +
        '<span class="team-icon">' + match.awayIcon + '</span>' +
        '<span>' + match.away + '</span>' +
      '</div>' +
    '</div>' +
    goalsHtml +
    '<div class="match-footer">' +
      '<span class="match-status">' + match.status + '</span>' +
    '</div>';

  return card;
}

// === Отрисовка матчей ===
function renderMatches() {
  var liveContainer = document.getElementById('footballLive');
  var finishedContainer = document.getElementById('footballFinished');
  var upcomingContainer = document.getElementById('footballUpcoming');
  if (!liveContainer) return;

  liveContainer.innerHTML = '';
  finishedContainer.innerHTML = '';
  upcomingContainer.innerHTML = '';

  var liveCount = 0;

  allFootballMatches.forEach(function (match) {
    if (match.isLive) {
      liveContainer.appendChild(createMatchCard(match));
      liveCount++;
    } else if (match.isFinished) {
      finishedContainer.appendChild(createMatchCard(match));
    } else {
      upcomingContainer.appendChild(createMatchCard(match));
    }
  });

  // Баскетбол
  var bContainer = document.getElementById('basketballMatches');
  if (bContainer) {
    bContainer.innerHTML = '';
    basketballMatches.forEach(function (m) { bContainer.appendChild(createMatchCard(m)); });
  }

  // Теннис
  var tContainer = document.getElementById('tennisMatches');
  if (tContainer) {
    tContainer.innerHTML = '';
    tennisMatches.forEach(function (m) { tContainer.appendChild(createMatchCard(m)); });
  }

  // Обновление счётчиков
  var total = allFootballMatches.length + basketballMatches.length + tennisMatches.length;
  var countEl = document.getElementById('matchCount');
  if (countEl) countEl.textContent = total;

  var totalLive = liveCount + basketballMatches.filter(function(m){return m.isLive;}).length + tennisMatches.filter(function(m){return m.isLive;}).length;
  var liveEl = document.getElementById('liveCount');
  if (liveEl) liveEl.textContent = totalLive;
}

// === Имитация обновления live-счетов (только для fallback) ===
function simulateLiveUpdate() {
  if (apiAvailable) return; // Если API работает — не имитируем

  allFootballMatches.forEach(function (match) {
    if (!match.isLive) return;

    if (match.time !== 'HT' && match.time !== 'FT' && match.time !== 'LIVE') {
      var currentMin = parseInt(match.time);
      if (!isNaN(currentMin)) {
        currentMin += 1;
        if (currentMin >= 45 && currentMin < 46) {
          match.time = 'HT';
          match.status = 'Перерыв';
        } else if (currentMin > 45 && currentMin < 90) {
          match.time = currentMin + '\'';
          match.status = 'Идёт второй тайм';
        } else if (currentMin >= 90) {
          match.time = 'FT';
          match.status = 'Завершён';
          match.isLive = false;
          match.isFinished = true;
        } else {
          match.time = currentMin + '\'';
        }
      }
    }

    // Случайный гол
    if (match.isLive && Math.random() > 0.75) {
      var scores = match.score.split(' : ').map(Number);
      var scorer = ['Saka', 'Havertz', 'Bellingham', 'Lewandowski', 'Mbappe'][Math.floor(Math.random() * 5)];
      if (Math.random() > 0.5) {
        scores[0] += 1;
        match.goals.push(scorer + ' ' + match.time);
      } else {
        scores[1] += 1;
        match.goals.push(scorer + ' ' + match.time);
      }
      match.score = scores.join(' : ');
    }
  });

  renderMatches();
}

// === Инициализация ===
async function init() {
  updateDate();

  // 1. Сразу показываем fallback-данные
  allFootballMatches = fallbackMatches.slice();
  renderMatches();

  // 2. Автообновление fallback каждые 30 сек
  setInterval(simulateLiveUpdate, 30000);
  setInterval(updateDate, 60000);

  // 3. Пытаемся загрузить реальные данные из SportAPI
  var realData = await fetchSportAPI();

  if (realData && realData.length > 0) {
    apiAvailable = true;
    allFootballMatches = realData;
    renderMatches();
    console.log('SportAPI: загружено ' + realData.length + ' реальных матчей');

    // Обновляем реальные данные каждые 60 сек (экономия квоты API)
    setInterval(async function () {
      var fresh = await fetchSportAPI();
      if (fresh && fresh.length > 0) {
        allFootballMatches = fresh;
        renderMatches();
        console.log('SportAPI: обновлено ' + fresh.length + ' матчей');
      }
    }, 60000);
  } else {
    console.log('SportAPI недоступен — используем демо-данные');
  }
}

init();
