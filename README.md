# Sydney Games Festival 2026

A small Jekyll site intended for GitHub Pages.

## Local preview

1. Use Ruby 3.1–3.3 (the repository's `.ruby-version` requests 3.1.7).
2. Install the Ruby dependencies: `bundle install`
3. Start the site: `bundle exec jekyll serve`
4. Open the address printed by Jekyll (normally `http://127.0.0.1:4000`).

The home page includes a live countdown to the festival start. Page artwork in
`assets/` is copied from the supplied export.

## FAQs

Each FAQ is a Markdown file in `_faqs/`. To add one, create a new file with a
`title`, numeric `order` and `featured` flag in its front matter, then write the
answer below it. Set `featured: true` to include it on the About page; every FAQ
appears on the full FAQ index.
