---
layout: default
title: About
slug: about
permalink: /about/
description: A city-wide celebration created by a coalition of Sydney’s games communities.
hero_theme: coral
hero_eyebrow: About
hero_title: Sydney's festival of games
social_image: /assets/images/about-hero.png
organisations: true
---

{% include hero.html %}

<section class="colour-band coral-band">
  <div class="container facts">
    <div class="fact"><strong>Date</strong>12 Oct → 18 Oct</div>
    <div class="fact"><strong>City</strong>Sydney, NSW</div>
    <div class="fact"><strong>Expect</strong>Games, tabletop, community, learning</div>
  </div>
</section>

<section class="content-section">
  <div class="container text-centre">
    <div class="about-summary">
      <p>Sydney Games Festival is a week-long program of events created by a coalition of Sydney’s games communities. Together, these groups bring independently produced events into one coordinated, city-wide festival celebrating games and the people who make, support and play them.</p>
    </div>
    <div class="about-description">
      <p>Sydney is home to a rich and growing games culture, built by creators, players, students, studios and community organisers. Games are being made, played and celebrated across the city every day, but that activity often happens separately and is not always easy to discover. The festival creates a shared stage where these communities can connect, collaborate and bring their work to a wider audience. It gives the public a clearer way to discover the people, ideas and experiences already shaping games in Sydney.</p>
      <p>Spanning digital games, tabletop games, experimental work and games in education, the week offers many ways to take part. Visitors might encounter new work at a showcase, meet local creators, contribute to a playtest, learn through a talk or workshop, join a game jam, make industry connections or experience games through meetups, live music, interactive performances and watch parties. Together, they reflect the many ways games can be creative, social and cultural experiences. Whether someone makes games, supports them or simply loves to play, there is a place for everyone at the festival.</p>
      <p>While 2026 marks the festival’s beginning, its purpose is long term: to celebrate local work, help the public discover Sydney-made games and build relationships that sustain the city’s games culture. By connecting communities that do not often cross paths, increasing their collective visibility and supporting the activity that already exists, Sydney Games Festival can create momentum across Sydney’s games landscape. Over time, it can help establish Sydney as a city where games culture is widely recognised, supported and able to thrive.</p>
    </div>
  </div>
</section>

<section class="colour-band coral-band">
  <div class="container text-centre">
    <p class="eyebrow">FAQ</p>
    <h2>What to know before Sydney Games Festival</h2>
    <div class="faq-links">
    {% assign featured_faqs = site.faqs | where: "featured", true | sort: "order" %}
    {% for faq in featured_faqs %}
      {% capture faq_url %}/faqs/#{{ faq.slug }}{% endcapture %}
      <a class="faq-list-link" href="{{ faq_url | relative_url }}">
        <span>{{ faq.title }}</span>
        <span class="faq-arrow" aria-hidden="true">→</span>
      </a>
    {% endfor %}
    </div>
    <p class="more-faqs"><a class="button" href="{{ '/faqs/' | relative_url }}">More FAQs</a></p>
  </div>
</section>

{% include organisation-showcase.html %}
