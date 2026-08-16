---
layout: default
title: Organisations
slug: organisations
permalink: /organisations/
description: The organisations helping bring Sydney Games Festival to life.
---

<section class="hero">
  <div class="container hero-copy">
    <p class="eyebrow">Festival community</p>
    <h1>Organisations</h1>
    <p class="lede">Meet the community groups creating, supporting and hosting events across Sydney Games Festival.</p>
  </div>
</section>

<section class="content-section organisation-directory-section">
  <div class="container">
    {% assign organisations = site.organisations | sort: "order" %}
    <div class="organisation-directory-wrap">
      <table class="organisation-directory-table">
        <thead>
          <tr>
            <th scope="col">Logo</th>
            <th scope="col">Organisation</th>
            <th scope="col">About</th>
          </tr>
        </thead>
        <tbody>
          {% for organisation in organisations %}
          {% unless organisation.credits_only %}
          <tr>
            <td>
              {% if organisation.website %}
              <a class="organisation-directory-logo" href="{{ organisation.website }}" aria-label="Visit {{ organisation.title }}">
                <img src="{{ organisation.logo | relative_url }}" alt="{{ organisation.title }} logo" loading="lazy">
              </a>
              {% else %}
              <span class="organisation-directory-logo">
                <img src="{{ organisation.logo | relative_url }}" alt="{{ organisation.title }} logo" loading="lazy">
              </span>
              {% endif %}
            </td>
            <th scope="row">{{ organisation.title }}</th>
            <td>{{ organisation.summary }}</td>
          </tr>
          {% endunless %}
          {% endfor %}
        </tbody>
      </table>
    </div>
  </div>
</section>
