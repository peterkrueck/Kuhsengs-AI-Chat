<script>
  import Auth from '$lib/components/Auth.svelte';
  import Chat from '$lib/components/Chat.svelte';
  import { auth } from '$lib/firebase';
  import { onMount } from 'svelte';

  let user = null;

  onMount(() => {
    return auth.onAuthStateChanged((newUser) => {
      user = newUser;
    });
  });
</script>

<main class={!user ? 'with-background' : ''}>
  <header>
    <h1>Kuhseng's Chat</h1>
    {#if user}
      <Auth />
    {/if}
  </header>

  <div class="chat-wrapper">
    {#if user}
      <Chat />
    {:else}
      <div class="welcome-message">
        <h2>Welcome to Kuhseng's Chat!</h2>
        <p>Experience the next level of chat interaction with AI-powered features.</p>
        <div class="features">
          <h3>Features:</h3>
          <ul>
            <li>Real-time chat with other users</li>
            <li>AI-powered chat assistant (Kuhilligence)</li>
            <li>Use <code>$joke</code> to get contextual jokes</li>
            <li>Use <code>$summary</code> to get chat summaries</li>
            <li>Use <code>&&</code> to generate AI images from chat context</li>
            <li>Random emoji reactions from Kuhilligence</li>
            <li>Dark/Light mode support</li>
          </ul>
        </div>
        <div class="login-container">
          <Auth />
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main.with-background {
    background-image: url('/IMG_7364.JPG');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    position: relative;
  }

  main.with-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    height: 64px;
    position: relative;
    z-index: 2;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-primary);
  }

  .chat-wrapper {
    flex: 1;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .welcome-message {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
    background-color: var(--bg-secondary);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .welcome-message h2 {
    margin-top: 0;
    color: var(--text-primary);
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .welcome-message p {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .features {
    text-align: left;
    margin: 2rem 0;
  }

  .features h3 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1.3rem;
  }

  .features ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .features li {
    margin: 0.8rem 0;
    color: var(--text-secondary);
    font-size: 1.1rem;
  }

  code {
    background-color: var(--bg-input);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
  }

  .login-container {
    margin-top: 2rem;
  }

  .login-container :global(.auth-container) {
    justify-content: center;
    margin: 0;
    padding: 0;
  }

  .login-container :global(.sign-in-btn) {
    background-color: #dc3545;
    font-size: 1.2rem;
    padding: 1rem 2rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .login-container :global(.sign-in-btn:hover) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }

  @media (max-width: 600px) {
    .welcome-message {
      margin: 1rem;
      padding: 1.5rem;
    }

    h1 {
      font-size: 1.2rem;
    }

    .welcome-message h2 {
      font-size: 1.5rem;
    }

    .welcome-message p {
      font-size: 1rem;
    }

    .features li {
      font-size: 1rem;
    }

    .login-container :global(.sign-in-btn) {
      font-size: 1.1rem;
      padding: 0.8rem 1.6rem;
    }
  }
</style>
