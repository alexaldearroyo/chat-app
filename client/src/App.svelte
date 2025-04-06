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
<div class="container">
  <h2>Join a group</h2>
  <div class="form-wrapper">
    <input bind:value={username} placeholder="Username" />
    <input bind:value={group} placeholder="Group" />
    <button on:click={joinGroup}>Join</button>
  </div>
</div>

{:else}
<h2>Group: {group}</h2>
<div class="chat-wrapper">
  <h3 class="username-label">Your Username: {username}</h3>
  <div class="chat-box">
    {#each messages as msg}
      <div class="message">
        <strong>{msg.username}:</strong> {msg.content}
      </div>
    {/each}
  </div>
  <input class="message-input" bind:value={message} placeholder="Your message" maxlength="200" />
  <button on:click={sendMessage}>Send</button>
</div>
{/if}
