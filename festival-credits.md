---
layout: default
title: Festival Credits
slug: festival-credits
permalink: /festival-credits/
---

<section class="hero">
  <div class="container hero-copy">
    <p class="eyebrow">Festival information</p>
    <h1>Festival Credits</h1>
    <p class="lede">The people helping bring Sydney Games Festival to life.</p>
    <p><a class="button" href="{{ '/organisations/' | relative_url }}">View festival organisations</a></p>
  </div>
</section>

## Festival Organisation

| Work | Credits |
| ---: | --- |
| Planning Committee | [George Mak](https://linktr.ee/dinopoke), [Liezl Ronquillo](https://www.linkedin.com/in/liezlartist), [Ryan Cross](https://games.ryancross.com), Ryan Penning, [Sandra Trinh](https://www.linkedin.com/in/sandra-trinh/), [Matt Cabang](https://www.linkedin.com/in/mattavc/) |
| Partnerships | Ryan Cross |

## Marketing & Branding

| Work | Credits |
| ---: | --- |
| Logo | Adam Younis, with input from a few others |
| Graphics | [Liezl Ronquillo](https://www.linkedin.com/in/liezlartist) (animating icons) |
| Website | Designed by Ryan Penning by hand with Framer; (re)built by Ryan Cross with Jekyll |
| Social media | [Sandra Trinh](https://www.linkedin.com/in/sandra-trinh/), with support from [Esthefania Morantes](https://au.linkedin.com/in/esthefaniamorantes/), [Marrel Bito](https://www.linkedin.com/in/marell-bito-a28978247) and [Ryan Cross](https://games.ryancross.com) |

## Volunteers
<section>
  <div class="container">
    <b>Full list of people contributing to the festival in some way</b>

{% assign volunteer_people = "" | split: "" %}
{% for organisation in site.organisations %}
  {% assign volunteer_people = volunteer_people | concat: organisation.people %}
{% endfor %}
{% assign volunteer_people = volunteer_people | uniq | sort: "name" %}
    <ul class="festival-volunteers">
      {% for person in volunteer_people %}
      <li>
        {% if person.url %}
        <a href="{{ person.url }}">{{ person.name }}</a>
        {% else %}
        {{ person.name }}
        {% endif %}
      </li>
      {% endfor %}
    </ul>
    <p><strong>Total volunteers:</strong> {{ volunteer_people | size }}</p>
    <p><a class="button" href="{{ '/get-involved/' | relative_url }}">Join the team!</a></p>
  </div>
</section>

## Organisations

{% assign organisations = site.organisations | sort: "order" %}
<table class="festival-credit-organisations">
  <thead>
    <tr>
      <th scope="col">Logo</th>
      <th scope="col">People</th>
    </tr>
  </thead>
  <tbody>
    {% for organisation in organisations %}
    {% unless organisation.credits_only %}
    <tr>
      <td>
        <span class="festival-credit-organisation-logo">
          <img src="{{ organisation.logo | relative_url }}" alt="{{ organisation.title }} logo" loading="lazy">
        </span>
      </td>
      <td>
        {% if organisation.people and organisation.people != empty %}
        <ul class="festival-credit-organisation-people">
          {% for person in organisation.people %}
          <li>
            {% if person.url %}
            <a href="{{ person.url }}">{{ person.name }}</a>
            {% else %}
            {{ person.name }}
            {% endif %}
          </li>
          {% endfor %}
        </ul>
        {% else %}
        <span aria-label="No people listed">—</span>
        {% endif %}
      </td>
    </tr>
    {% endunless %}
    {% endfor %}
  </tbody>
</table>
