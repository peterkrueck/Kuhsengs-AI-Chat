<script>
  export let message;
  export let isCurrentUser = false;

  function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  }

  function isImageMessage(message) {
    return message.isImage || message.message.startsWith('![');
  }

  function getImageUrl(message) {
    if (message.isImage) {
      return message.message.match(/\((.*?)\)/)[1];
    }
    return message.message.match(/\((.*?)\)/)[1];
  }
</script>

<div class="message-container {isCurrentUser ? 'current-user' : ''}">
  <div class="message-content">
    {#if !isCurrentUser}
      <div class="avatar">
        <img src={message.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed={message.username}'} 
             alt="Avatar" />
      </div>
    {/if}
    <div class="message-bubble">
      <div class="username">
        {#if isCurrentUser}
          You
        {:else}
          {message.username}
        {/if}
      </div>
      {#if isImageMessage(message)}
        <div class="image-container">
          <img src={getImageUrl(message)} alt="Generated Image" class="generated-image" />
        </div>
      {:else}
        <div class="text">{message.message}</div>
      {/if}
      <div class="timestamp">{formatTimestamp(message.timestamp)}</div>
    </div>
  </div>
</div>

<style>
  .message-container {
    display: flex;
    margin: 0.5rem 0;
    padding: 0 1rem;
  }

  .message-content {
    display: flex;
    gap: 0.5rem;
    max-width: 70%;
  }

  .current-user {
    justify-content: flex-end;
  }

  .current-user .message-bubble {
    background-color: #4285f4;
    color: white;
    border-radius: 18px 18px 4px 18px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .message-bubble {
    background-color: var(--bg-secondary);
    padding: 0.5rem 1rem;
    border-radius: 18px 18px 18px 4px;
    position: relative;
    min-width: 120px;
  }

  .username {
    font-weight: 500;
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
    color: var(--text-secondary);
  }

  .current-user .username {
    text-align: right;
    color: rgba(255, 255, 255, 0.9);
  }

  .text {
    word-break: break-word;
    line-height: 1.4;
  }

  .image-container {
    margin: 0.5rem 0;
    max-width: 100%;
    border-radius: 8px;
    overflow: hidden;
  }

  .generated-image {
    width: 100%;
    max-width: 512px;
    height: auto;
    display: block;
    border-radius: 8px;
  }

  .timestamp {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: 0.2rem;
    text-align: right;
  }

  .current-user .timestamp {
    color: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 600px) {
    .message-content {
      max-width: 85%;
    }

    .generated-image {
      max-width: 100%;
    }
  }
</style>
