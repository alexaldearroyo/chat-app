<script lang="ts">
import type { ChatMessage, Group } from '../../shared/types';
import { socket } from './services/socket';
  import { onMount } from 'svelte';
  import JoinGroupForm from './components/JoinGroupForm.svelte';
  import ChatWindow from './components/ChatWindow.svelte';

  let username = '';
  let group = '';
  let groupName = '';
  let message = '';
  let messages: ChatMessage[] = [];
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

  function leaveGroup() {
    connected = false;
    group = '';
    groupName = '';
    message = '';
    messages = [];
  }

  onMount(() => {
    socket.on('message', (msg: ChatMessage) => {
      messages = [...messages, msg];
    });

    // TODO: Request message history when joining a group
    socket.on('groupsList', (groups: Group[]) => {
      if (groups.length > 0 || Date.now() - lastGroupsUpdate > 5000) {
        availableGroups = groups;
        lastGroupsUpdate = Date.now();
      }
      if (groups.length === 0 && !connected) {
        showCreateGroup = true;
      }
    });

    getGroups();
  });
</script>

{#if !connected}
  <JoinGroupForm
    {username}
    {group}
    {groupName}
    {availableGroups}
    {showCreateGroup}
    {showGroupDropdown}
    onUpdateUsername={(v) => username = v}
    onUpdateGroupName={(v) => groupName = v}
    onJoin={joinGroup}
    onCreate={createGroup}
    toggleDropdown={toggleGroupDropdown}
    selectGroup={selectGroup}
    toggleFormMode={() => showCreateGroup = !showCreateGroup}
  />
{:else}
  <ChatWindow
    {username}
    {group}
    {groupName}
    {availableGroups}
    {messages}
    {message}
    onSend={sendMessage}
    onUpdateMessage={(v) => message = v}
    onLeave={leaveGroup}
  />
{/if}
