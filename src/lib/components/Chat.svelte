<script>
  import { onMount } from 'svelte';
  import { db, auth } from '$lib/firebase';
  import { collection, query, orderBy, limit, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
  import Message from './Message.svelte';
  import Kuhilligence from './Kuhilligence.svelte';
  import { notificationEnabled, initializeNotifications, showNotification } from '../services/notifications';

  let messages = [];
  let newMessage = '';
  let messagesContainer;
  let unsubscribe;
  let lastMessageTimestamp = Date.now();

  onMount(() => {
    initializeNotifications();
    
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
      messages = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .reverse();
      
      // Handle notifications for new messages
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && 
          latestMessage.timestamp && 
          latestMessage.uid !== auth.currentUser?.uid &&
          latestMessage.timestamp.toMillis() > lastMessageTimestamp) {
        handleNewMessage(latestMessage);
      }
      
      // Scroll to bottom after messages update
      setTimeout(() => {
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 0);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  });

  function handleNewMessage(message) {
    if (document.hidden && $notificationEnabled) {
      showNotification(
        `New message from ${message.username}`,
        message.message
      );
    }
    lastMessageTimestamp = message.timestamp.toMillis();
  }

  async function handleSubmit() {
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'messages'), {
        message: newMessage,
        timestamp: serverTimestamp(),
        username: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        uid: auth.currentUser.uid
      });

      newMessage = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  function handleAiMessage(event) {
    const aiMessage = event.detail;
    addDoc(collection(db, 'messages'), {
      ...aiMessage,
      uid: 'ai'
    });
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  async function toggleNotifications() {
    const enabled = $notificationEnabled;
    if (!enabled) {
      await initializeNotifications();
    } else {
      $notificationEnabled = false;
    }
  }
</script>

<div class="chat-container">
  <div class="notification-toggle">
    <button 
      class="notification-btn" 
      on:click={toggleNotifications}
      title={$notificationEnabled ? 'Disable notifications' : 'Enable notifications'}
    >
      {#if $notificationEnabled}
        🔔
      {:else}
        🔕
      {/if}
    </button>
  </div>

  <div class="messages" bind:this={messagesContainer}>
    {#each messages as message (message.id)}
      <Message 
        {message} 
        isCurrentUser={auth.currentUser && message.uid === auth.currentUser.uid} 
      />
    {/each}
  </div>

  <Kuhilligence 
    recentMessages={messages.slice(-5)} 
    on:aiMessage={handleAiMessage}
  />

  <div class="input-container">
    <textarea
      bind:value={newMessage}
      on:keypress={handleKeyPress}
      placeholder="Type a message..."
      rows="1"
      disabled={!auth.currentUser}></textarea>
    <button 
      on:click={handleSubmit} 
      disabled={!newMessage.trim() || !auth.currentUser}>
      Send
    </button>
  </div>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px); /* Adjust based on your header height */
    background-color: var(--bg-primary);
    position: relative;
  }

  .notification-toggle {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
  }

  .notification-btn {
    background: var(--bg-secondary);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .notification-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
  }

  .input-container {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    background-color: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
  }

  textarea {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    resize: none;
    background-color: var(--bg-input);
    color: var(--text-primary);
    font-family: inherit;
    line-height: 1.4;
  }

  textarea:disabled {
    background-color: var(--bg-disabled);
    cursor: not-allowed;
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  button:disabled {
    background-color: var(--bg-disabled);
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    opacity: 0.9;
  }

  /* Custom scrollbar */
  .messages::-webkit-scrollbar {
    width: 6px;
  }

  .messages::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  .messages::-webkit-scrollbar-thumb {
    background: var(--scrollbar);
    border-radius: 3px;
  }

  .messages::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-hover);
  }

  @media (max-width: 600px) {
    .notification-btn {
      width: 36px;
      height: 36px;
      font-size: 1.1rem;
    }
  }
</style>
