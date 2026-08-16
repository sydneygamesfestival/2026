---
layout: default
title: Program
slug: program
permalink: /program/
description: Explore games events happening across Sydney throughout the festival week.
hero_theme: orange
hero_eyebrow: Program
hero_title: Find out what's on and when
social_image: /assets/images/program-hero.png
program_schedule: true
---

{% include hero.html %}

<section class="colour-band orange-band">
  <div class="container facts">
    <div class="fact"><strong>Where?</strong>Sydney, NSW</div>
    <div class="fact"><strong>When?</strong>Begins 12 Oct 2026, 5:00 pm</div>
    <div class="fact"><strong>Until</strong>18 Oct 2026</div>
  </div>
</section>

<!--
<section class="content-section">
  <div class="container text-centre">
    <p class="eyebrow">Coming soon</p>
    <h2>The 2026 festival schedule is being assembled</h2>
    <p>Individual communities will announce their own events, venues and entry details. Check back soon, or join the mailing list for updates.</p>
    <a class="button" href="{{ '/mailing-list/' | relative_url }}">Get program updates</a>
  </div>
</section>
-->

<section class="content-section program-overview">
  <div class="container">
    <div class="text-centre">
      <p class="eyebrow">Recently updated</p>
      <h2>Program overview</h2>
      <p>A week-at-a-glance view of featured events during the festival.</p>
    </div>

    <div class="program-week" role="region" aria-label="Festival week at a glance" tabindex="0">
      <table>
        <caption class="visually-hidden">Featured Sydney Games Festival events from 12 to 18 October 2026</caption>
        <thead>
          <tr>
            <th scope="col"><span>Mon</span><strong>12</strong><span>Oct</span></th>
            <th scope="col"><span>Tue</span><strong>13</strong><span>Oct</span></th>
            <th scope="col"><span>Wed</span><strong>14</strong><span>Oct</span></th>
            <th scope="col"><span>Thu</span><strong>15</strong><span>Oct</span></th>
            <th scope="col"><span>Fri</span><strong>16</strong><span>Oct</span></th>
            <th scope="col"><span>Sat</span><strong>17</strong><span>Oct</span></th>
            <th scope="col"><span>Sun</span><strong>18</strong><span>Oct</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="program-week-empty" aria-label="No featured event announced">—</span></td>
            <td><a class="program-week-event" href="#full-schedule" data-schedule-date="2026-10-13">Constellations</a></td>
            <td><span class="program-week-empty" aria-label="No featured event announced">—</span></td>
            <td><a class="program-week-event" href="#full-schedule" data-schedule-date="2026-10-15">Extra Lives Concert</a></td>
            <td><span class="program-week-empty" aria-label="No featured event announced">—</span></td>
            <td><a class="program-week-event" href="#full-schedule" data-schedule-date="2026-10-17">Takeover</a></td>
            <td><span class="program-week-empty" aria-label="No featured event announced">—</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-centre">
      <p>Individual communities will announce their own events, venues and entry details. Check back soon, or join the mailing list for updates.</p>
      <div class="signup">
        <a class="button" href="{{ '/mailing-list/' | relative_url }}">Get program updates</a>
        <a class="button" href="#full-schedule">Current schedule</a>
      </div>
    </div>
  </div>
</section>

<section class="colour-band orange-band" aria-label="Festival values">
  <div class="marquee">
    <div class="marquee-track">
      <span class="marquee-group">Fun · Play · Vibes · Jams · Community · Creativity · Innovation · For everyone · </span>
      <span class="marquee-group" aria-hidden="true">Fun · Play · Vibes · Jams · Community · Creativity · Innovation · For everyone · </span>
    </div>
  </div>
</section>

<section class="content-section schedule-section" id="full-schedule" aria-labelledby="schedule-heading">
  <div class="container">
    <div class="text-centre schedule-intro">
      <p class="eyebrow">Full program</p>
      <h2 id="schedule-heading">Plan your festival</h2>
      <p>Choose a date and filter events by who they are for. Event details are updated as communities announce them.</p>
    </div>

    <div
      class="schedule"
      id="program-schedule"
      data-events-url="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_QICyyTV2CLhcoyQOO_v3HshLMA2MQBGU-dIjFxMLDImYkPN1pCvswFjGinOqqOHAVlLNyGblw6KN/pub?gid=171864363&amp;single=true&amp;output=csv"
      data-sample-url="{{ '/assets/data/program-events-sample.csv' | relative_url }}"
      data-image-base-url="{{ '/assets/images/program/' | relative_url }}"
      data-notify-url="{{ '/mailing-list/' | relative_url }}"
    >
      <div class="schedule-layout">
        <nav class="schedule-days" id="schedule-days" aria-label="Festival dates"></nav>

        <div class="schedule-main">
          <label class="schedule-mobile-day" for="schedule-day-select">
            <span>Festival date</span>
            <select id="schedule-day-select"></select>
          </label>

          <p class="schedule-source-note" id="schedule-source-note" hidden></p>
          <p class="schedule-loading" id="schedule-loading" role="status">Loading the current schedule…</p>

          <div class="schedule-day-header" id="schedule-day-header" hidden>
            <h3 id="schedule-day-title"></h3>
          </div>

          <div class="schedule-filters" id="schedule-filters" aria-label="Filter by audience"></div>
          <div class="schedule-cards" id="schedule-cards" aria-live="polite"></div>
        </div>
      </div>
    </div>
  </div>
</section>
