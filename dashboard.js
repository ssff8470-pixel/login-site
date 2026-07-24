// ============================================
//  LiveScore — реальные данные через OpenLigaDB
//  API: https://www.openligadb.de (бесплатно, без ключа)
// ============================================

// === Реальные данные Бундеслиги (резерв, если API недоступен из-за CORS) ===
const fallbackMatches = [
  // Завершённые матчи 34-го тура (16 мая 2026)
  { league: 'Бундеслига — 34 тур', home: 'Бавария', away: 'Кёльн', score: '5 : 1', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '🔴', awayIcon: '⚪', goals: ['H. Kane 10\'', 'H. Kane 13\'', 'S. El Mala 18\'', 'T. Bischof 22\'', 'H. Kane 69\'', 'N. Jackson 83\''] },
  { league: 'Бундеслига — 34 тур', home: 'Айнтрахт', away: 'Штутгарт', score: '2 : 2', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '⚫', awayIcon: '⚪', goals: ['Chema Andres 10\'', 'N. Nartey 45+1\'', 'J. Burkardt 72\' (pen)', 'J. Burkardt 90+1\' (pen)'] },
  { league: 'Бундеслига — 34 тур', home: 'Фрайбург', away: 'Лейпциг', score: '4 : 1', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '🔴', awayIcon: '⚪', goals: ['J. Beste 24\'', 'I. Matanovic 26\'', 'A. Ouedraogo 33\'', 'M. Ginter 47\'', 'D. Scherhant 75\''] },
  { league: 'Бундеслига — 34 тур', home: 'Бремен', away: 'Дортмунд', score: '0 : 2', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '🟢', awayIcon: '🟡', goals: ['S. Guirassy 59\'', 'Yan Couto 90+1\''] },
  { league: 'Бундеслига — 34 тур', home: 'Гладбах', away: 'Хоффенхайм', score: '4 : 0', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '⚫', awayIcon: '🔵', goals: ['H. Bolin 14\'', 'H. Tabakovic 23\'', 'H. Tabakovic 64\'', 'R. Hack 90+1\''] },
  { league: 'Бундеслига — 34 тур', home: 'Унион Берлин', away: 'Аугсбург', score: '4 : 0', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '🔴', awayIcon: '🟢', goals: ['A. Ilic 10\'', 'A. Ilic 43\'', 'A. Schäfer 54\'', 'W. Jeong 89\''] },
  { league: 'Бундеслига — 34 тур', home: 'Леверкузен', away: 'Гамбург', score: '1 : 1', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '🔴', awayIcon: '🔵', goals: ['Fábio Vieira 61\'', 'Torunarigha 78\' (og)'] },
  { league: 'Бундеслига — 34 тур', home: 'Хайденхайм', away: 'Майнц', score: '0 : 2', status: 'Завершён', time: 'FT', isLive: false, isFinished: true, homeIcon: '🔴', awayIcon: '🔴', goals: ['P. Tietz 7\'', 'N. Amiri 43\''] },
  // Предстоящие матчи 1-го тура (август 2026) — имитируем как LIVE
  { league: 'Бундеслига — 1 тур', home: 'Бавария', away: 'Штутгарт', score: '1 : 0', status: 'Идёт первый тайм', time: '23\'', isLive: true, isFinished: false, homeIcon: '🔴', awayIcon: '⚪', goals: ['H. Kane 12\''] },
  { league: 'Бундеслига — 1 тур', home: 'Лейпциг', away: 'Гладбах', score: '0 : 0', status: 'Идёт первый тайм', time: '15\'', isLive: true, isFinished: false, homeIcon: '⚪', awayIcon: '⚫', goals: [] },
  { league: 'Бундеслига — 1 тур', home: 'Дортмунд', away: 'Гамбург', score: '2 : 1', status: 'Перерыв', time: 'HT', isLive: true, isFinished: false, homeIcon: '🟡', awayIcon: '🔵', goals: ['S. Guirassy 28\'', 'J. Brandt 41\'', 'A. Hountondji 38\''] },
  { league: 'Бундеслига — 1 тур', home: 'Байер Леверкузен', away: 'Эльверсберг', score: '0 : 0', status: 'Ожидается', time: '20:30', isLive: false, isFinished: false, homeIcon: '🔴', awayIcon: '⚫', goals: [] }
];

// === Баскетбол и теннис — демо-данные ===
const basketballMatches = [
  { league: 'NBA', home: 'Лейкерс', away: 'Бостон', score: '89 : 82', status: '3-я четверть', time: 'Q3 05:24', isLive: true, homeIcon: '🟣', awayIcon: '🟢' },
  { league: 'Евролига', home: 'ЦСКА', away: 'Реал Мадрид', score: '67 : 70', status: '4-я четверть', time: 'Q4 02:10', isLive: true, homeIcon: '🔴', awayIcon: '⚪' }
];

const tennisMatches = [
  { league: 'ATP — Уимблдон', home: 'Джокович Н.', away: 'Алькарас К.', score: '6 : 4', status: '2-й сет', time: '3:2', isLive: true, homeIcon: '🇷🇸', awayIcon: '🇪🇸' },
  { league: 'WTA — Ролан Гаррос', home: 'Свёнтек И.', away: 'Сабалэнка А.', score: '4 : 6', status: '1-й сет', time: '4:5', isLive: true, homeIcon: '🇵🇱', awayIcon: '🇧🇾' }
];

// === Состояние ===
let allFootballMatches = [];
let liveMinute = 23; // Имитация минут матча

// === Загрузка реальных данных из OpenLigaDB ===
async function fetchOpenLigaDB() {
  try {
    // Таймаут 5 секунд — если API не отвечает, используем резервные данные
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 5000);

    var response = await fetch('https://www.openligadb.de/api/getmatchdata/bl1/2025/34', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('API error: ' + response.status);
    var data = await response.json();

    return data.map(function (m) {
      var score1 = 0, score2 = 0;
      if (m.matchResults && m.matchResults.length > 0) {
        var final = m.matchResults.find(function (r) { return r.resultName === 'Endergebnis'; });
        if (final) { score1 = final.pointsTeam1; score2 = final.pointsTeam2; }
      }

      var goals = (m.goals || []).map(function (g) {
        var min = g.matchMinute + '\'';
        if (g.isOvertime) min += '+';
        if (g.isPenalty) min += ' (pen)';
        if (g.isOwnGoal) min += ' (og)';
        return g.goalGetterName + ' ' + min;
      });

      return {
        league: 'Бундеслига — ' + m.group.groupName,
        home: m.team1.teamName,
        away: m.team2.teamName,
        score: score1 + ' : ' + score2,
        status: 'Завершён',
        time: 'FT',
        isLive: false,
        isFinished: true,
        homeIcon: '⚽',
        awayIcon: '⚽',
        goals: goals
      };
    });
  } catch (err) {
    console.warn('OpenLigaDB API недоступен, используем резервные данные:', err.message);
    return null;
  }
}

// === Обновление даты ===
function updateDate() {
  var now = new Date();
  var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  document.getElementById('currentDate').textContent = now.toLocaleDateString('ru-RU', options);
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
  // Футбол — LIVE
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

  // Обновление счётчика
  var total = allFootballMatches.length + basketballMatches.length + tennisMatches.length;
  var countEl = document.getElementById('matchCount');
  if (countEl) countEl.textContent = total;

  var liveEl = document.getElementById('liveCount');
  if (liveEl) liveEl.textContent = liveCount + basketballMatches.filter(function(m){return m.isLive;}).length + tennisMatches.filter(function(m){return m.isLive;}).length;
}

// === Имитация обновления live-счетов ===
function simulateLiveUpdate() {
  allFootballMatches.forEach(function (match) {
    if (!match.isLive) return;

    // Обновление минуты
    if (match.time !== 'HT' && match.time !== 'FT') {
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
      var scorer = ['H. Kane', 'S. Guirassy', 'J. Brandt', 'L. Díaz', 'M. Olise'][Math.floor(Math.random() * 5)];
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

  // Баскетбол
  basketballMatches.forEach(function (match) {
    if (match.isLive && Math.random() > 0.4) {
      var scores = match.score.split(' : ').map(Number);
      scores[0] += Math.floor(Math.random() * 3) + 1;
      scores[1] += Math.floor(Math.random() * 3) + 1;
      match.score = scores.join(' : ');
    }
  });

  renderMatches();
}

// === Инициализация ===
async function init() {
  updateDate();

  // Сначала сразу показываем fallback-данные (с live-матчами!)
  allFootballMatches = fallbackMatches.slice();
  renderMatches();

  // Автообновление каждые 30 секунд
  setInterval(simulateLiveUpdate, 30000);
  setInterval(updateDate, 60000);

  // Параллельно пытаемся загрузить реальные данные из API
  var realData = await fetchOpenLigaDB();

  if (realData && realData.length > 0) {
    // Реальные завершённые матчи + демо live/upcoming
    allFootballMatches = realData.concat(fallbackMatches.filter(function (m) {
      return m.isLive || !m.isFinished;
    }));
    renderMatches();
    console.log('Реальные данные загружены: ' + realData.length + ' матчей');
  } else {
    console.log('Используем демо-данные (API недоступен)');
  }
}

init();
