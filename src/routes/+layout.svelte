<script>
  import { onMount } from 'svelte';

  let darkMode = false;

  onMount(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    darkMode = storedTheme ? storedTheme === 'dark' : prefersDark;
    applyTheme();
  });

  function toggleTheme() {
    darkMode = !darkMode;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    applyTheme();
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }
</script>

<div class="app">
  <div class="theme-toggle-container">
    <button class="theme-toggle" on:click={toggleTheme}>
      {darkMode ? '☀️' : '🌙'}
    </button>
  </div>
  <slot />
</div>

<style>
  :global(:root) {
    /* Light theme */
    --bg-primary: rgba(255, 255, 255, 0.9);
    --bg-secondary: rgba(245, 245, 245, 0.95);
    --bg-input: rgba(255, 255, 255, 0.95);
    --bg-button: rgba(224, 224, 224, 0.95);
    --bg-disabled: rgba(224, 224, 224, 0.95);
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-tertiary: #999999;
    --border-color: rgba(224, 224, 224, 0.8);
    --scrollbar: rgba(204, 204, 204, 0.8);
    --scrollbar-hover: rgba(153, 153, 153, 0.8);
  }

  :global([data-theme="dark"]) {
    --bg-primary: rgba(26, 26, 26, 0.9);
    --bg-secondary: rgba(45, 45, 45, 0.95);
    --bg-input: rgba(61, 61, 61, 0.95);
    --bg-button: rgba(77, 77, 77, 0.95);
    --bg-disabled: rgba(61, 61, 61, 0.95);
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --text-tertiary: #999999;
    --border-color: rgba(64, 64, 64, 0.8);
    --scrollbar: rgba(64, 64, 64, 0.8);
    --scrollbar-hover: rgba(77, 77, 77, 0.8);
  }

  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    position: relative;
  }

  .theme-toggle-container {
    position: fixed;
    top: 1rem;
    right: 5rem;
    z-index: 1000;
  }

  .theme-toggle {
    padding: 0.5rem;
    border: none;
    border-radius: 50%;
    background: var(--bg-secondary);
    cursor: pointer;
    font-size: 1.2rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .theme-toggle:hover {
    background: var(--bg-button);
  }

  @media (max-width: 600px) {
    .theme-toggle-container {
      right: 4rem;
    }
  }
</style>
