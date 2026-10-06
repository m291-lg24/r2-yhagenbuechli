<template>
  <header class="topbar">
    <div class="topbar-inner">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">M</span>

        <span class="brand-copy">
          <strong>Matchday</strong>
          <small>Content Planner</small>
        </span>
      </RouterLink>

      <nav class="navigation" aria-label="Hauptnavigation">
        <RouterLink to="/">
          Dashboard
        </RouterLink>

        <RouterLink to="/matches">
          Matches
        </RouterLink>
      </nav>
    </div>
  </header>
</template>