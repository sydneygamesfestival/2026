/* Sydney Games Festival public schedule
 *
 * Adapted from the standalone site for this Jekyll site. The
 * published Google Sheet remains the primary source. 
 */
(function () {
  const schedule = document.querySelector('#program-schedule');
  if (!schedule) return;

  const festivalDays = [
    { iso: '2026-10-12', day: 'Mon', date: '12 Oct', label: 'Monday 12 October' },
    { iso: '2026-10-13', day: 'Tue', date: '13 Oct', label: 'Tuesday 13 October' },
    { iso: '2026-10-14', day: 'Wed', date: '14 Oct', label: 'Wednesday 14 October' },
    { iso: '2026-10-15', day: 'Thu', date: '15 Oct', label: 'Thursday 15 October' },
    { iso: '2026-10-16', day: 'Fri', date: '16 Oct', label: 'Friday 16 October' },
    { iso: '2026-10-17', day: 'Sat', date: '17 Oct', label: 'Saturday 17 October' },
    { iso: '2026-10-18', day: 'Sun', date: '18 Oct', label: 'Sunday 18 October' },
  ];

  const extraScopes = {
    before: { key: 'before', date: 'Before', day: 'Pre-festival', label: 'Before the festival' },
    after: { key: 'after', date: 'After', day: 'Post-festival', label: 'After the festival' },
  };

  const audienceOptions = [
    { key: 'players', label: 'Players' },
    { key: 'makers', label: 'Makers' },
    { key: 'learners', label: 'Learners' },
  ];

  const audienceMap = {
    'general public': 'players',
    'beginner players': 'players',
    'experienced players': 'players',
    'beginner makers': 'makers',
    'experienced makers': 'makers',
    'other industry players': 'makers',
    students: 'learners',
    academics: 'learners',
  };

  const elements = {
    days: schedule.querySelector('#schedule-days'),
    daySelect: schedule.querySelector('#schedule-day-select'),
    sourceNote: schedule.querySelector('#schedule-source-note'),
    loading: schedule.querySelector('#schedule-loading'),
    dayHeader: schedule.querySelector('#schedule-day-header'),
    dayTitle: schedule.querySelector('#schedule-day-title'),
    filters: schedule.querySelector('#schedule-filters'),
    cards: schedule.querySelector('#schedule-cards'),
  };

  const state = {
    events: [],
    selectedDay: null,
    audiences: new Set(),
    preview: { sample: false, draft: false },
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[character];
    });
  }

  function normalise(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function previewOptions() {
    const parameters = new URLSearchParams(window.location.search);
    const dataMode = normalise(parameters.get('data'));
    return {
      sample: parameters.has('sample') || dataMode === 'sample',
      draft: parameters.has('draft') || dataMode === 'draft',
    };
  }

  function cleanText(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }

  function splitList(value) {
    return cleanText(value)
      .split(',')
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function gameKindFromMedium(value) {
    const media = splitList(value);
    if (!media.length) return '';
    if (media.length > 1) return 'Multiple Kinds';

    const medium = normalise(media[0]);
    if (medium.includes('digital') || medium.includes('screen')) return 'Screen (Digital)';
    if (medium.includes('tabletop') || medium.includes('live play') ||
        medium.includes('parlour') || medium.includes('larp')) {
      return 'Tabletop & Live Play (Non-Digital)';
    }
    return 'Other';
  }

  function gameKind(row, headers, detailedTypes) {
    const explicitKind = gameKindFromMedium(pick(row, headers, 'medium of games'));
    if (explicitKind) return explicitKind;

    /* The original sample CSV predates Game Medium. Keep it usable by deriving
       a broad kind from its detailed game-type selections. */
    const types = normalise(detailedTypes.join(' '));
    const hasDigital = /\b(pc|mobile|console|arcade|digital|video|vr|ar)\b/.test(types);
    const hasTabletop = /\b(board|card|tcg|tabletop|rpg|megagame|miniature|war game|larp|cosplay|parlour)\b/.test(types);
    if (hasDigital && hasTabletop) return 'Multiple Kinds';
    if (hasDigital) return 'Screen (Digital)';
    if (hasTabletop) return 'Tabletop & Live Play (Non-Digital)';
    return 'Other';
  }

  function cleanUrl(value) {
    const raw = cleanText(value);
    if (!raw) return '';

    try {
      const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : 'https://' + raw;
      const url = new URL(candidate);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
    } catch (error) {
      return '';
    }
  }

  /* Small CSV reader that handles quoted commas, quotes and line breaks. */
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let quoted = false;
    const input = String(text || '').replace(/^\uFEFF/, '');

    for (let index = 0; index < input.length; index += 1) {
      const character = input[index];

      if (quoted) {
        if (character === '"' && input[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else if (character === '"') {
          quoted = false;
        } else {
          cell += character;
        }
      } else if (character === '"') {
        quoted = true;
      } else if (character === ',') {
        row.push(cell);
        cell = '';
      } else if (character === '\n') {
        row.push(cell);
        if (row.some(function (value) { return value.trim(); })) rows.push(row);
        row = [];
        cell = '';
      } else if (character !== '\r') {
        cell += character;
      }
    }

    row.push(cell);
    if (row.some(function (value) { return value.trim(); })) rows.push(row);
    if (!rows.length) return [];

    const headers = rows.shift().map(cleanText);
    return rows.map(function (values) {
      return headers.reduce(function (result, header, index) {
        result[header] = values[index] || '';
        return result;
      }, {});
    });
  }

  function headerIndex(row) {
    return Object.keys(row).map(function (header) {
      return { raw: header, normalised: normalise(header) };
    });
  }

  function pick(row, headers) {
    const tokens = Array.prototype.slice.call(arguments, 2).map(normalise);
    const match = headers.find(function (header) {
      return tokens.every(function (token) { return header.normalised.includes(token); });
    });
    return match ? cleanText(row[match.raw]) : '';
  }

  function dateToIso(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  }

  function parseDate(value) {
    const text = cleanText(value);
    if (!text) return '';

    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    let match = text.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (match) return dateToIso(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])));

    match = text.match(/([a-z]{3,9})\.?\s+(\d{1,2})/i);
    if (match && months[match[1].slice(0, 3).toLowerCase()] != null) {
      return dateToIso(new Date(2026, months[match[1].slice(0, 3).toLowerCase()], Number(match[2])));
    }

    match = text.match(/(\d{1,2})\s+([a-z]{3,9})/i);
    if (match && months[match[2].slice(0, 3).toLowerCase()] != null) {
      return dateToIso(new Date(2026, months[match[2].slice(0, 3).toLowerCase()], Number(match[1])));
    }

    match = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (match) {
      let month = Number(match[1]);
      let day = Number(match[2]);
      if (month > 12) [day, month] = [month, day];
      const year = match[3] ? Number(match[3]) : 2026;
      return dateToIso(new Date(year < 100 ? 2000 + year : year, month - 1, day));
    }

    const timestamp = Date.parse(text);
    return Number.isNaN(timestamp) ? '' : dateToIso(new Date(timestamp));
  }

  function parseTime(value) {
    const text = cleanText(value);
    if (!text) return null;

    const match = text.match(/(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?/i);
    if (!match) return null;

    let hour = Number(match[1]);
    const minute = Number(match[2] || 0);
    const meridiem = (match[3] || '').toLowerCase().replace(/\./g, '');
    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    return hour <= 23 && minute <= 59 ? hour * 60 + minute : null;
  }

  function buildEvent(row) {
    const headers = headerIndex(row);
    const specificDate = parseDate(pick(row, headers, 'specific date'));
    const dayIsos = festivalDays.some(function (day) { return day.iso === specificDate; })
      ? [specificDate]
      : [];

    if (!dayIsos.length) {
      festivalDays.forEach(function (day) {
        const planned = pick(row, headers, 'still planning', 'oct ' + Number(day.iso.slice(-2)));
        if (planned) dayIsos.push(day.iso);
      });
    }

    let region = '';
    if (!dayIsos.length && specificDate) {
      region = specificDate < festivalDays[0].iso ? 'before' : 'after';
    } else if (!dayIsos.length) {
      region = 'other';
    }

    const startTime = pick(row, headers, 'start time');
    const endTime = pick(row, headers, 'end time');
    const organisation = pick(row, headers, 'organisation');
    const title = pick(row, headers, 'event name') || organisation || 'Untitled event';
    const planningStage = normalise(pick(row, headers, 'stage of planning'));
    const detailedGameTypes = splitList(pick(row, headers, 'type of games'));

    return {
      title: title,
      organisation: organisation,
      published: /^y/.test(normalise(pick(row, headers, 'published'))),
      draftReady: planningStage.startsWith('confirmed') || planningStage.startsWith('announced'),
      description: pick(row, headers, 'marketing blurb') || pick(row, headers, 'tell us about'),
      gameKind: gameKind(row, headers, detailedGameTypes),
      gameTypes: detailedGameTypes,
      audiences: splitList(pick(row, headers, 'type of audience')),
      duration: pick(row, headers, 'how long', 'duration') || pick(row, headers, 'duration'),
      location: pick(row, headers, 'where do you plan'),
      ticketUrl: cleanUrl(pick(row, headers, 'what url should we direct')),
      thumbnail: cleanUrl(pick(row, headers, 'url to thumbnail')),
      startTime: startTime,
      endTime: endTime,
      startMinutes: parseTime(startTime),
      endMinutes: parseTime(endTime),
      dayIsos: dayIsos,
      region: region,
    };
  }

  async function fetchEvents(url, includeDrafts) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('The schedule feed returned ' + response.status);
    const rows = parseCsv(await response.text());
    return rows.map(buildEvent).filter(function (event) {
      return event.published || (includeDrafts && event.draftReady);
    });
  }

  async function loadEvents() {
    const preview = previewOptions();
    const sourceUrl = preview.sample ? schedule.dataset.sampleUrl : schedule.dataset.eventsUrl;
    return {
      events: await fetchEvents(sourceUrl, preview.draft),
      preview: preview,
    };
  }

  function scopes() {
    return [extraScopes.before]
      .concat(festivalDays.map(function (day) {
        return { key: day.iso, date: day.date, day: day.day, label: day.label };
      }))
      .concat([extraScopes.after]);
  }

  function eventsForDay(key) {
    if (festivalDays.some(function (day) { return day.iso === key; })) {
      return state.events.filter(function (event) { return event.dayIsos.includes(key); });
    }
    return state.events.filter(function (event) { return event.region === key; });
  }

  function audienceBuckets(event) {
    return new Set(event.audiences.map(function (audience) {
      return audienceMap[audience.toLowerCase().trim()];
    }).filter(Boolean));
  }

  function passesAudienceFilter(event) {
    if (!state.audiences.size) return true;
    const buckets = audienceBuckets(event);
    return Array.from(state.audiences).some(function (audience) { return buckets.has(audience); });
  }

  function formatTime(minutes) {
    let hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const meridiem = hour >= 12 ? 'pm' : 'am';
    hour %= 12;
    if (hour === 0) hour = 12;
    return hour + (minute ? ':' + String(minute).padStart(2, '0') : '') + ' ' + meridiem;
  }

  function eventTime(event) {
    if (event.startMinutes == null) return 'Time to come';
    if (event.endMinutes == null) return formatTime(event.startMinutes);
    return formatTime(event.startMinutes) + ' – ' + formatTime(event.endMinutes);
  }

  function audienceBadge(event) {
    const values = event.audiences.join(' ').toLowerCase();
    if (values.includes('maker')) return 'Makers';
    if (values.includes('industry')) return 'Industry';
    if (values.includes('academic')) return 'Academics';
    if (values.includes('student')) return 'Students';
    if (values.includes('player')) return 'Players';
    if (values.includes('public')) return 'Everyone';
    return event.audiences[0] || '';
  }

  function metaItem(label, value) {
    return '<div><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value || 'To come') + '</strong></div>';
  }

  function imageHtml(event) {
    if (!event.thumbnail) {
      return '<div class="schedule-card-image schedule-card-image-empty"><span>Image to come</span></div>';
    }
    return '<div class="schedule-card-image"><img src="' + escapeHtml(event.thumbnail) + '" alt="' +
      escapeHtml(event.title + ' event artwork') + '"></div>';
  }

  function cardHtml(event) {
    const badge = audienceBadge(event);
    const ticket = event.ticketUrl
      ? '<a class="schedule-ticket" href="' + escapeHtml(event.ticketUrl) + '" target="_blank" rel="noopener">Event details</a>'
      : '<span class="schedule-ticket schedule-ticket-unavailable">Details to come</span>';

    return '<article class="schedule-card">' +
      '<div class="schedule-card-top">' +
        '<strong class="schedule-card-time">' + escapeHtml(eventTime(event)) + '</strong>' +
        (badge ? '<span class="schedule-audience">' + escapeHtml(badge) + '</span>' : '') +
        ticket +
      '</div>' +
      '<h3>' + escapeHtml(event.title) + '</h3>' +
      (event.organisation ? '<p class="schedule-organisation">' + escapeHtml(event.organisation) + '</p>' : '') +
      '<div class="schedule-card-body">' +
        imageHtml(event) +
        '<div class="schedule-card-about"><h4>About</h4><p>' + escapeHtml(event.description || 'Further event details will be announced soon.') + '</p></div>' +
      '</div>' +
      '<div class="schedule-card-meta">' +
        metaItem('Games', event.gameKind) +
        metaItem('Location', event.location) +
        metaItem('Duration', event.duration) +
      '</div>' +
    '</article>';
  }

  function emptyHtml(hasEventsForDay) {
    const message = hasEventsForDay
      ? 'No events match those audience filters for this date.'
      : 'No events have been announced for this date yet.';
    return '<div class="schedule-empty"><p>' + message + '</p>' +
      '<a class="button" href="' + escapeHtml(schedule.dataset.notifyUrl) + '">Get program updates</a></div>';
  }

  function renderDays() {
    elements.days.innerHTML = scopes().map(function (scope) {
      const active = scope.key === state.selectedDay;
      return '<button class="schedule-day' + (active ? ' active' : '') + '" type="button" data-day="' +
        escapeHtml(scope.key) + '" aria-pressed="' + active + '"><strong>' + escapeHtml(scope.date) +
        '</strong><span>' + escapeHtml(scope.day) + '</span></button>';
    }).join('');

    elements.daySelect.innerHTML = scopes().map(function (scope) {
      return '<option value="' + escapeHtml(scope.key) + '"' + (scope.key === state.selectedDay ? ' selected' : '') + '>' +
        escapeHtml(scope.date + ' — ' + scope.day) + '</option>';
    }).join('');
  }

  function renderFilters() {
    const allActive = state.audiences.size === 0;
    const allButton = '<button class="schedule-filter' + (allActive ? ' active' : '') +
      '" type="button" data-audience="" aria-pressed="' + allActive + '">All</button>';
    const buttons = audienceOptions.map(function (option) {
      const active = state.audiences.has(option.key);
      return '<button class="schedule-filter' + (active ? ' active' : '') + '" type="button" data-audience="' +
        option.key + '" aria-pressed="' + active + '">' + option.label + '</button>';
    }).join('');
    elements.filters.innerHTML = allButton + buttons;
  }

  function render() {
    renderDays();
    renderFilters();

    const dayEvents = eventsForDay(state.selectedDay);
    const visibleEvents = dayEvents
      .filter(passesAudienceFilter)
      .sort(function (first, second) {
        return (first.startMinutes == null ? Infinity : first.startMinutes) -
          (second.startMinutes == null ? Infinity : second.startMinutes);
      });
    const selectedScope = scopes().find(function (scope) { return scope.key === state.selectedDay; });

    elements.loading.hidden = true;
    elements.dayHeader.hidden = false;
    let sourceNote = '';
    if (state.preview.sample && state.preview.draft) {
      sourceNote = 'Sample and draft preview: showing published, confirmed and announced sample events.';
    } else if (state.preview.sample) {
      sourceNote = 'Sample preview: showing the packaged schedule data.';
    } else if (state.preview.draft) {
      sourceNote = 'Draft preview: showing published events plus confirmed and announced events.';
    }
    elements.sourceNote.textContent = sourceNote;
    elements.sourceNote.hidden = !sourceNote;
    elements.dayTitle.textContent = selectedScope ? selectedScope.label : '';
    elements.cards.innerHTML = visibleEvents.length
      ? visibleEvents.map(cardHtml).join('')
      : emptyHtml(dayEvents.length > 0);

    elements.cards.querySelectorAll('.schedule-card-image img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.parentElement.classList.add('schedule-card-image-empty');
        image.parentElement.innerHTML = '<span>Image to come</span>';
      }, { once: true });
    });
  }

  function selectDay(day) {
    if (!scopes().some(function (scope) { return scope.key === day; })) return;
    state.selectedDay = day;
    render();
  }

  elements.days.addEventListener('click', function (event) {
    const button = event.target.closest('[data-day]');
    if (button) selectDay(button.dataset.day);
  });

  elements.daySelect.addEventListener('change', function (event) {
    selectDay(event.target.value);
  });

  elements.filters.addEventListener('click', function (event) {
    const button = event.target.closest('[data-audience]');
    if (!button) return;

    const audience = button.dataset.audience;
    if (!audience) {
      state.audiences.clear();
    } else if (state.audiences.has(audience)) {
      state.audiences.delete(audience);
    } else {
      state.audiences.add(audience);
    }
    render();
  });

  document.querySelectorAll('[data-schedule-date]').forEach(function (link) {
    link.addEventListener('click', function () {
      selectDay(link.dataset.scheduleDate);
    });
  });

  loadEvents()
    .then(function (result) {
      state.events = result.events;
      state.preview = result.preview;
      const firstDayWithEvents = festivalDays.find(function (day) {
        return state.events.some(function (event) { return event.dayIsos.includes(day.iso); });
      });
      state.selectedDay = firstDayWithEvents ? firstDayWithEvents.iso : festivalDays[0].iso;
      render();
    })
    .catch(function (error) {
      console.error('The schedule could not be loaded.', error);
      elements.loading.hidden = true;
      elements.cards.innerHTML = '<div class="schedule-empty"><p>The schedule could not be loaded right now. Please try again shortly.</p></div>';
    });
})();
