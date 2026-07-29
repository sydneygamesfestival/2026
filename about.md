---
layout: default
title: About
slug: about
permalink: /about/
---

<section class="hero">
  <div class="container">
    <img class="hero-image" src="{{ '/assets/images/about-hero.png' | relative_url }}" alt="Sydney Games Festival about page artwork">
    <div class="hero-copy">
      <p class="eyebrow">About</p>
      <h1>Sydney's festival of games</h1>
      <p class="lede">A festival organised by a committee of Sydney's games communities to host a city-wide celebration across industry, digital and tabletop games.</p>
    </div>
  </div>
</section>

<section class="colour-band coral-band">
  <div class="container facts">
    <div class="fact"><strong>Date</strong>13 Oct → 18 Oct</div>
    <div class="fact"><strong>City</strong>Sydney, NSW</div>
    <div class="fact"><strong>Expect</strong>Games, tabletop, community, learning</div>
  </div>
</section>

<section class="content-section">
  <div class="container cards">
    <article class="card"><h3>Games</h3><p>A local selection of games and game-making events.</p></article>
    <article class="card"><h3>Events</h3><p>A variety of events for games of all kinds.</p></article>
    <article class="card"><h3>Community</h3><p>Communities coming together to celebrate games and Sydney.</p></article>
  </div>
</section>

<section class="colour-band coral-band">
  <div class="container text-centre">
    <h2>What is it?</h2>
    <p>Sydney Games Festival is a week-long series of events organised by communities coming together to celebrate shared culture across games in Sydney.</p>
    <h2>Who is it for?</h2>
    <p>Game makers, adjacent groups and their related fields—especially communities across digital, tabletop, board games and experimental formats.</p>
    <h2>Why is it being organised?</h2>
    <p>Sydney has a deep community of organisations who care about games across all forms and styles. The festival enriches these communities and supports activity and connection around gaming.</p>
  </div>
</section>

<section class="content-section">
  <div class="container text-centre">
    <p class="eyebrow">Key foundational communities</p>
    <h2>The groups bringing the festival to life</h2>
    <p>They are hosting events, collaborating with others or supporting the festival's organisation across Sydney.</p>
    <ul class="community-list">
      <li>IGDA Sydney</li>
      <li>Table Top Game Designers of Australia</li>
      <li>Avant Harde Drive</li>
      <li>Pixel Pasture</li>
      <li>Playmakers</li>
      <li>UNSW Game Making Society</li>
      <li>Sydney Tabletop Association</li>
      <li>More communities to be announced…</li>
    </ul>
  </div>
</section>

<section class="colour-band coral-band">
  <div class="container text-centre">
    <p class="eyebrow">FAQ</p>
    <h2>What to know before Sydney Games Fest</h2>
    {% assign faqs = site.faqs | sort: "order" %}
    {% for faq in faqs %}
      <details>
        <summary>{{ faq.title }}</summary>
        {{ faq.content | markdownify }}
      </details>
    {% endfor %}
  </div>
</section>
