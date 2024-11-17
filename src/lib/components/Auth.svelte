<script>
  import { auth, googleProvider } from '$lib/firebase';
  import { signInWithPopup, signOut } from 'firebase/auth';
  import { onMount } from 'svelte';

  let user = null;

  onMount(() => {
    return auth.onAuthStateChanged((newUser) => {
      user = newUser;
    });
  });

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
</script>

<div class="auth-container">
  {#if user}
    <div class="user-profile">
      <img src={user.photoURL} alt="Profile" class="avatar" />
      <span class="username">{user.displayName}</span>
      <button on:click={handleSignOut} class="sign-out-btn">Sign Out</button>
    </div>
  {:else}
    <button on:click={signInWithGoogle} class="sign-in-btn">
      Sign in with Google
    </button>
  {/if}
</div>

<style>
  .auth-container {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    margin-right: 4rem; /* Add margin to prevent overlap with theme toggle */
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--bg-secondary);
    padding: 0.5rem 1rem;
    border-radius: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--border-color);
  }

  .username {
    font-weight: 500;
    color: var(--text-primary);
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .sign-in-btn {
    background-color: #4285f4;
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .sign-out-btn {
    background-color: var(--bg-button);
    color: var(--text-primary);
  }

  button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    .auth-container {
      margin-right: 3.5rem;
    }

    .username {
      max-width: 100px;
    }

    .user-profile {
      padding: 0.4rem 0.8rem;
    }

    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
  }
</style>
