# React + Vite

## Blog Feature

Project Architecture

<pre>
// Project Structure
src/
  ├── components/
  │   ├── blog/
  │   │   ├── BlogCard.jsx
  │   │   ├── BlogGrid.jsx
  │   │   ├── BlogSearch.jsx
  │   │   ├── BlogSorting.jsx
  │   │   ├── BlogTagsFilter.jsx
  │   │   └── BlogPagination.jsx
  │   ├── ui/
  │   │   ├── Button.jsx
  │   │   ├── Card.jsx
  │   │   ├── Skeleton.jsx
  │   │   └── TagBadge.jsx
  │   └── layout/
  │       ├── PageHeader.jsx
  │       └── Section.jsx
  ├── pages/
  │   ├── BlogListPage.jsx
  │   └── BlogDetailPage.jsx
  ├── hooks/
  │   ├── useBlogPosts.js
  │   └── useDebounce.js
  ├── services/
  │   └── blogService.js
  ├── utils/
  │   └── formatters.js
  └── App.jsx
</pre>