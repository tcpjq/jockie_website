# Personal Blog Design

Date: 2026-06-05

## Goal

Build a personal homepage-style blog with Astro. The site publishes mixed content such as technical articles, essays, reading notes, and project logs. Articles are written as local Markdown files, with the structure kept simple enough for a first version and open to future MDX support.

## Recommended Approach

Use Astro as a static site generator with Content Collections for Markdown content. The first version will be a static site with no database, no login system, and no web-based admin UI.

This approach fits the current repository because it is nearly empty and has no existing framework constraints. It also fits the writing workflow: articles can live in Git as `.md` files, be reviewed like code, and deploy as static pages.

## Scope

### In Scope

- Astro project scaffold.
- Personal homepage with profile, writing themes, featured articles, recent articles, and project or social links.
- Blog index page.
- Blog detail pages generated from Markdown.
- Tag index page.
- Individual tag pages.
- About page.
- RSS feed.
- Basic SEO metadata.
- Responsive layout for desktop and mobile.
- Markdown support for headings, lists, links, images, blockquotes, tables, and code blocks.

### Out of Scope

- Web admin or CMS editing interface.
- Database-backed posts.
- Login system.
- Comments, likes, or user accounts.
- Full-text search.
- MDX components in articles.
- Multi-language routing.
- Analytics integration.

## Information Architecture

### Routes

- `/`: homepage.
- `/blog`: all published posts in reverse chronological order.
- `/blog/[slug]`: individual post pages.
- `/tags`: all tags used by published posts.
- `/tags/[tag]`: posts filtered by tag.
- `/about`: extended personal introduction.
- `/rss.xml`: RSS feed.

### Homepage

The homepage is the primary entry point, not a marketing landing page. It should quickly communicate who the site belongs to, what topics appear here, and where to start reading.

Sections:

- Profile introduction.
- Writing themes for mixed content, such as technology, notes, essays, and projects.
- Featured posts.
- Recent posts.
- Project or external links.

### Blog Index

The blog index lists all non-draft posts by publication date. Each item shows title, description, date, category, and tags.

### Post Page

Each post page renders Markdown with readable typography, stable content width, publication metadata, tags, and basic SEO fields.

### Tags

Tags provide lightweight organization across mixed content. Categories are broader and appear on posts, while tags are more flexible and many-to-many.

## Content Model

Posts are stored under `src/content/blog/` as Markdown files.

Example frontmatter:

```yaml
title: "Article title"
description: "Short summary for lists, RSS, and SEO."
pubDate: 2026-06-05
updatedDate: 2026-06-05
category: "Technology"
tags: ["Astro", "Blog"]
draft: false
featured: true
```

Fields:

- `title`: required string.
- `description`: required string.
- `pubDate`: required date.
- `updatedDate`: optional date.
- `category`: required string.
- `tags`: optional string array, defaulting to an empty array.
- `draft`: optional boolean, defaulting to false.
- `featured`: optional boolean, defaulting to false.

Draft posts must not appear in production lists, generated routes, tags, or RSS.

## Architecture

### Astro Content Collections

Define a `blog` collection with schema validation for frontmatter. Pages query this collection instead of scanning files manually. This keeps content data typed and catches malformed posts during development or build.

### Components

Expected components:

- `Layout`: shared HTML shell, metadata, navigation, and footer.
- `PostCard`: compact post preview for lists.
- `TagList`: normalized tag links.
- `ProfileIntro`: homepage introduction block.
- `SectionHeader`: reusable section heading for homepage areas.

These components should stay small and presentation-focused. Content querying belongs in pages or collection helpers rather than deeply inside visual components.

### Utilities

Expected helpers:

- Fetch all published posts.
- Sort posts by publication date.
- Fetch featured posts.
- Derive all tags from published posts.
- Normalize tag slugs for tag routes.

## Visual Design

The site should feel like a personal homepage with a strong reading experience:

- Clean top navigation.
- Calm, readable typography.
- Homepage sections that are easy to scan.
- Article pages with constrained line length.
- Cards used for repeated article items only.
- Responsive layout that preserves readable text and avoids cramped controls on mobile.

The design should avoid a heavy marketing-style hero. The first viewport should still make the owner and purpose of the site clear.

## Error Handling

- Missing post route: Astro should return a normal 404.
- Draft post route in production: draft posts should not generate routes.
- Invalid frontmatter: build should fail through content collection schema validation.
- Empty tag result: tag routes should only be generated from existing published tags.

## Testing And Verification

Verification should include:

- Build succeeds.
- Type checking succeeds if configured by the scaffold.
- Homepage renders.
- Blog index renders published posts.
- Post detail route renders Markdown.
- Draft posts are excluded from lists, generated pages, tags, and RSS.
- Tag routes include only matching published posts.
- RSS includes published posts only.
- Basic responsive checks for desktop and mobile widths.

## Future Extensions

Possible later additions:

- MDX support for interactive posts.
- Full-text search.
- Comment system.
- Analytics.
- Newsletter or email subscription.
- CMS-backed editing with Git-based content storage.
- Series pages for long-form notes or tutorials.
