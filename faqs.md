---
layout: default
title: FAQs
slug: faqs
permalink: /faqs/
---

<section class="hero faq-hero">
  <div class="container hero-copy">
    <p class="eyebrow">FAQ</p>
    <h1>Frequently asked questions</h1>
    <p class="lede">Answers to common questions about Sydney Games Fest.</p>
  </div>
</section>

<section class="content-section faq-index">
  <div class="container">
    {% assign faqs = site.faqs | sort: "order" %}
    {% for faq in faqs %}
      {% capture faq_url %}/faqs/#{{ faq.slug }}{% endcapture %}
      <details class="faq-entry" id="{{ faq.slug }}">
        <summary>{{ faq.title }}</summary>
        <div class="faq-answer">
          {{ faq.content | markdownify }}
          <p class="faq-permalink"><a href="{{ faq_url | relative_url }}">Link to this FAQ</a></p>
        </div>
      </details>
    {% endfor %}
  </div>
</section>
