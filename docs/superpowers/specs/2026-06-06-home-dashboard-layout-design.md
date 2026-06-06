# Home Dashboard Layout Design

## Goal

Transform the home page into a compact personal knowledge base dashboard while preserving the existing dark starfield, blue glow, translucent cards, and Astro blog structure.

## Layout

The first screen uses the reference image direction:

- Top navigation: 首页, 文章, 项目, 知识地图, 关于, RSS.
- Hero: title "Jockie 的个人知识基地", supporting copy from the idea note, and topic pills.
- Dashboard grid: left time coordinate cards, center featured articles and recent updates, right short about card and yesterday observation card.
- Lower sections: knowledge map and project archive use responsive card grids below the dashboard.

## Behavior

- Current time and countdown cards are calculated on the client with static target dates.
- Featured articles use `featured: true`; if none exist, the section falls back to recent published posts.
- Knowledge map counts are derived from published post tags and categories with simple keyword matching.
- Project archive and yesterday observation are static placeholders for now.
- Mobile layout collapses to one column with generous spacing.

## Files

- `src/components/Layout.astro`: update navigation labels and anchors.
- `src/pages/index.astro`: build the dashboard sections and static data.
- `src/styles/global.css`: add reusable dashboard/card/grid styles and responsive rules.
- `tests/site.spec.ts`: update the home page test to cover the new structure.

## Verification

Run:

- `npm test`
- `npm run build`
- `npm run test:e2e`
