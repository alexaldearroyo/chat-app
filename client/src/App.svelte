<script lang="ts">
  import type { ChatMessage } from './services/types';
  import { socket } from './services/socket';
  import { onMount } from 'svelte';

  let username = '';
  let group = '';
  let message = '';
  let messages: { username: string; content: string; timestamp: number }[] = [];
  let connected = false;

  function joinGroup() {
    if (!username || !group) return;
    socket.emit('join', { username, group });
    connected = true;
  }

  function sendMessage() {
    if (message.length > 0 && message.length <= 200) {
      socket.emit('message', { content: message });
      message = '';
    }
  }

  onMount(() => {
    socket.on('message', (msg: ChatMessage) => {
      messages = [...messages, msg];
    });
  });
</script>

{#if !connected}
  <div>
    <h2>Join a group</h2>
    <input bind:value={username} placeholder="Username" />
    <input bind:value={group} placeholder="Group" />
    <button on:click={joinGroup}>Join</button>
  </div>
{:else}
  <div>
    <h2>Group: {group}</h2>
    <div style="border: 1px solid #ccc; padding: 1rem; height: 200px; overflow-y: auto;">
      {#each messages as msg}
        <p><strong>{msg.username}:</strong> {msg.content}</p>
      {/each}
    </div>
    <input bind:value={message} placeholder="Your message (max 200 chars)" maxlength="200" />
    <button on:click={sendMessage}>Send</button>
  </div>
{/if}
