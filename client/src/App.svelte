<script lang="ts">
  import type { ChatMessage, Group } from './services/types';
  import { socket } from './services/socket';
  import { onMount } from 'svelte';

  let username = '';
  let group = '';
  let groupName = '';
  let message = '';
  let messages: { username: string; content: string; timestamp: number }[] = [];
  let connected = false;
  let availableGroups: Group[] = [];
  let showCreateGroup = false;
  let lastGroupsUpdate = 0;
  let showGroupDropdown = false;

  function joinGroup() {
    if (!username || !group) return;
    socket.emit('join', { username, group });
    connected = true;
  }

  function createGroup() {
    if (!username || !groupName) return;
    socket.emit('createGroup', { name: groupName, username });
    connected = true;
  }

  function getGroups() {
    console.log("Requesting groups list from server");
    socket.emit('getGroups');
  }

  function sendMessage() {
    if (message.length > 0 && message.length <= 200) {
      socket.emit('message', { content: message });
      message = '';
    }
  }

  function toggleGroupDropdown() {
    showGroupDropdown = !showGroupDropdown;
  }

  function selectGroup(groupId: string) {
    group = groupId;
    showGroupDropdown = false;
  }

  onMount(() => {
    socket.on('message', (msg: ChatMessage) => {
      messages = [...messages, msg];
    });

    socket.on('groupsList', (groups: Group[]) => {
      console.log("Received groups update:", groups);
      // Only update if we have groups or it's been a while since last update
      if (groups.length > 0 || Date.now() - lastGroupsUpdate > 5000) {
        availableGroups = groups;
        lastGroupsUpdate = Date.now();
        console.log("Updated availableGroups:", availableGroups);
      }

      // If there are no groups available, show the create group form by default
      if (groups.length === 0 && !connected) {
        showCreateGroup = true;
      }
    });

    // Request the groups list when component mounts
    getGroups();

    // Update the list more frequently to keep it up-to-date
    const interval = setInterval(getGroups, 5000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

{#if !connected}
<div class="container">
  <h2>Chat App</h2>
  <div class="form-wrapper">
    <input bind:value={username} placeholder="Username" />

    {#if showCreateGroup}
      <div class="section-title">Create a new group</div>
      <input bind:value={groupName} placeholder="New group name" />
      <button on:click={createGroup} class="primary-btn">Create group</button>
      <button on:click={() => showCreateGroup = false} class="secondary-btn">Back to join options</button>
    {:else}
      <div class="section-title">Join an existing group</div>
      {#if availableGroups.length > 0}
        <div class="group-selector">
          <div class="custom-select">
            <button
              class="select-button"
              on:click={toggleGroupDropdown}
              class:active={showGroupDropdown}
            >
              {#if group}
                {availableGroups.find(g => g.id === group)?.name || 'Select a group'}
              {:else}
                Select a group
              {/if}
              <span class="dropdown-arrow">▼</span>
            </button>

            {#if showGroupDropdown}
              <div class="dropdown-menu">
                {#each availableGroups as g}
                  <button
                    class="dropdown-item"
                    class:selected={group === g.id}
                    on:click={() => selectGroup(g.id)}
                  >
                    <span class="group-name">{g.name}</span>
                    <span class="group-creator">Created by: {g.createdBy}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <button
            on:click={joinGroup}
            class="primary-btn join-btn"
            disabled={!group}
          >
            Join group
          </button>
        </div>
      {:else}
        <div class="no-groups-message">
          <p class="info-text">No groups available yet.</p>
        </div>
      {/if}

      <div class="section-title">Or create your own</div>
      <button on:click={() => showCreateGroup = true} class="primary-btn create-group-btn">Create new group</button>
    {/if}
  </div>
</div>

{:else}
<h2>Chat App</h2>
<div class="chat-wrapper">
  <div class="user-info-row">
    <h3 class="username-label">Your username: {username}</h3>
    <h3 class="username-label">Group: {groupName || availableGroups.find(g => g.id === group)?.name}</h3>
  </div>

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
