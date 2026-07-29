# Sydney Games Fest 2026

A small Jekyll site intended for GitHub Pages.

## Local preview

1. Use Ruby 3.1–3.3 (the repository's `.ruby-version` requests 3.1.7).
2. Install the Ruby dependencies: `bundle install`
3. Start the site: `bundle exec jekyll serve`
4. Open the address printed by Jekyll (normally `http://127.0.0.1:4000`).

The site deliberately has no JavaScript or countdown timer at this stage. Page
artwork and icons in `assets/` are copied unchanged from the supplied export.

## FAQs

Each FAQ is a Markdown file in `_faqs/`. To add one, create a new file with a
`title` and numeric `order` in its front matter, then write the answer below it.
