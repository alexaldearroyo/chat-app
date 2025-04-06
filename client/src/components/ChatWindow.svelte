<script lang="ts">
  import type { ChatMessage, Group } from '../services/types';

  export let username: string;
  export let group: string;
  export let groupName: string;
  export let messages: ChatMessage[];
  export let availableGroups: Group[];
  export let message: string;

  export let onSend: () => void;
  export let onUpdateMessage: (v: string) => void;
  export let onLeave: () => void;
</script>

<h2>Chat App</h2>
<div class="chat-wrapper">
  <div class="user-info-row">
    <h3 class="username-label">Your username: {username}</h3>
    <h3 class="username-label">
      Group: {groupName || availableGroups.find(g => g.id === group)?.name}
    </h3>
    <!-- TODO: Show list of connected users in the group -->
  </div>

  <div class="chat-box">
    {#each messages as msg}
      <div class="message">
        <strong>{msg.username}:</strong> {msg.content}
        <!-- TODO: Display message timestamp -->
      </div>
    {/each}
  </div>

  <input
    class="message-input"
    bind:value={message}
    on:input={(e) => onUpdateMessage((e.target as HTMLInputElement).value)}
    placeholder="Your message"
    maxlength="200"
  />
  <button on:click={onSend}>Send</button>
  <!-- TODO: Add button to leave group -->
  <button on:click={onLeave} class="secondary-btn">Leave group</button>
</div>
