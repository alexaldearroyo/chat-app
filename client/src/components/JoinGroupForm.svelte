<script lang="ts">
import type { Group } from '../../../shared/types';
export let username: string;
  export let group: string;
  export let groupName: string;
  export let availableGroups: Group[];
  export let showCreateGroup: boolean;
  export let showGroupDropdown: boolean;

  export let onUpdateUsername: (v: string) => void;
  export let onUpdateGroupName: (v: string) => void;
  export let onJoin: () => void;
  export let onCreate: () => void;
  export let toggleDropdown: () => void;
  export let selectGroup: (id: string) => void;
  export let toggleFormMode: () => void;
</script>

<div class="container">
  <h2>Chat App</h2>
  <div class="form-wrapper">
    <input
    bind:value={username}
    on:input={(e) => onUpdateUsername((e.target as HTMLInputElement).value)}
    placeholder="Username"
  />

    {#if showCreateGroup}
      <div class="section-title">Create a new group</div>
      <input
        bind:value={groupName}
        on:input={(e) => onUpdateGroupName((e.target as HTMLInputElement).value)} placeholder="New group name"
      />
      <button on:click={onCreate} class="primary-btn">Create group</button>
      <button on:click={toggleFormMode} class="secondary-btn">Back to join options</button>
    {:else}
      <div class="section-title">Join an existing group</div>
      {#if availableGroups.length > 0}
        <div class="group-selector">
          <div class="custom-select">
            <button
              class="select-button"
              on:click={toggleDropdown}
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
                    <!-- TODO: Add button to delete group (only for creator) -->
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <button on:click={onJoin} class="primary-btn join-btn" disabled={!group}>Join group</button>
        </div>
      {:else}
        <div class="no-groups-message">
          <p class="info-text">No groups available yet.</p>
        </div>
      {/if}

      <div class="section-title">Or create your own</div>
      <button on:click={toggleFormMode} class="primary-btn create-group-btn">Create new group</button>
    {/if}
    <div class="footer">© 2025 Alex Arroyo</div>
  </div>
</div>
