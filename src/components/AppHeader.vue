<template>
  <aside class="sidebar">
    <RouterLink class="brand" to="/">
      <div class="brand-icon">
        M
      </div>

      <div>
        <span class="brand-title">Matchday</span>
        <span class="brand-subtitle">Content Planner</span>
      </div>
    </RouterLink>

    <nav class="navigation">
      <p class="nav-label">Workspace</p>

      <RouterLink to="/">
        <span class="nav-icon">⌂</span>
        Dashboard
      </RouterLink>

      <RouterLink to="/matches">
        <span class="nav-icon">▣</span>
        Matches
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <span>Matchday Content Planner</span>
      <small>Module 291</small>
    </div>
  </aside>
</template>