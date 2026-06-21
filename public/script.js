const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const loadingEl = document.getElementById('loading');

// Desktop elements
const clearHistoryBtn = document.getElementById('clear-history');
const exportHistoryBtn = document.getElementById('export-history');
const historyList = document.getElementById('history-list');
const settingsTab = document.getElementById('settings-tab');
const historyTab = document.getElementById('history-tab');
const settingsContent = document.getElementById('settings-content');
const historyContent = document.getElementById('history-content');
const newChatBtn = document.getElementById('new-chat');
const systemInstructionInput = document.getElementById('system-instruction');
const apiKeyInput = document.getElementById('api-key');
const apiKeySubmitBtn = document.getElementById('api-key-submit');

// Mobile elements
const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
const mobilePanel = document.getElementById('mobile-panel');
const closeMobilePanelBtn = document.getElementById('close-mobile-panel');
const mobileTabButtons = document.querySelectorAll('.mobile-tab-button');
const mobileTabContents = document.querySelectorAll('.mobile-tab-content');
const mobileClearHistoryBtn = document.getElementById('mobile-clear-history');
const mobileExportHistoryBtn = document.getElementById('mobile-export-history');
const mobileHistoryList = document.getElementById('mobile-history-list');
const mobileNewChatBtn = document.getElementById('mobile-new-chat');
const mobileSystemInstructionInput = document.getElementById('mobile-system-instruction');
const mobileApiKeyInput = document.getElementById('mobile-api-key');
const mobileApiKeySubmitBtn = document.getElementById('mobile-api-key-submit');
const apiStatus = document.getElementById('api-status');
const mobileApiStatus = document.getElementById('mobile-api-status');

// Sliders
const temperatureInput = document.getElementById('temperature');
const topPInput = document.getElementById('top-p');
const topKInput = document.getElementById('top-k');
const tempValue = document.getElementById('temp-value');
const toppValue = document.getElementById('topp-value');
const topkValue = document.getElementById('topk-value');

const mobileTemperatureInput = document.getElementById('mobile-temperature');
const mobileTopPInput = document.getElementById('mobile-top-p');
const mobileTopKInput = document.getElementById('mobile-top-k');
const mobileTempValue = document.getElementById('mobile-temp-value');
const mobileToppValue = document.getElementById('mobile-topp-value');
const mobileTopkValue = document.getElementById('mobile-topk-value');

let conversation = [];
let chatHistory = [];
let systemInstruction = 'Jawab hanya menggunakan bahasa Indonesia.';
let apiKey = '';

// ====== AUTO-SIZING TEXTAREA ======
function autoResizeTextarea() {
  input.style.height = 'auto';
  const newHeight = Math.min(Math.max(input.scrollHeight, 48), 128);
  input.style.height = newHeight + 'px';
}

input.addEventListener('input', autoResizeTextarea);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});

// ====== TAB SWITCHING ======
settingsTab.addEventListener('click', () => {
  settingsTab.classList.add('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
  settingsTab.classList.remove('text-gray-600', 'border-transparent');
  historyTab.classList.remove('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
  historyTab.classList.add('text-gray-600', 'border-transparent');
  settingsContent.classList.remove('hidden');
  historyContent.classList.add('hidden');
});

historyTab.addEventListener('click', () => {
  historyTab.classList.add('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
  historyTab.classList.remove('text-gray-600', 'border-transparent');
  settingsTab.classList.remove('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
  settingsTab.classList.add('text-gray-600', 'border-transparent');
  historyContent.classList.remove('hidden');
  settingsContent.classList.add('hidden');
});

// ====== MOBILE TAB SWITCHING ======
mobileTabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.getAttribute('data-tab');
    
    mobileTabButtons.forEach(b => {
      b.classList.remove('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
      b.classList.add('text-gray-600', 'border-transparent');
    });
    
    button.classList.add('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
    button.classList.remove('text-gray-600', 'border-transparent');
    
    mobileTabContents.forEach(content => content.classList.add('hidden'));
    document.getElementById(`mobile-${tab}-content`).classList.remove('hidden');
  });
});

// ====== MOBILE PANEL TOGGLE ======
mobileToggleBtn.addEventListener('click', () => {
  mobilePanel.classList.remove('hidden');
});

closeMobilePanelBtn.addEventListener('click', () => {
  mobilePanel.classList.add('hidden');
});

mobilePanel.addEventListener('click', (e) => {
  if (e.target === mobilePanel) {
    mobilePanel.classList.add('hidden');
  }
});

// ====== LOAD HISTORY ======
function loadHistory() {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    chatHistory = JSON.parse(saved);
    renderHistoryList();
  }
}

// ====== LOAD SYSTEM INSTRUCTION ======
function loadSystemInstruction() {
  const saved = localStorage.getItem('systemInstruction');
  if (saved) {
    systemInstruction = saved;
    systemInstructionInput.value = systemInstruction;
    mobileSystemInstructionInput.value = systemInstruction;
  }
}

// ====== LOAD API KEY ======
function loadApiKey() {
  const saved = localStorage.getItem('geminiApiKey');
  if (saved) {
    apiKey = saved;
    apiKeyInput.value = apiKey;
    mobileApiKeyInput.value = apiKey;
  }
  updateApiStatus();
}

// ====== LOAD CONFIGURATION FROM SERVER ======
async function loadConfigurationFromServer() {
  try {
    const response = await fetch('/api/get-config');
    const config = await response.json();

    // Update sliders
    temperatureInput.value = config.temperature;
    topPInput.value = config.topP;
    topKInput.value = config.topK;
    systemInstructionInput.value = config.systemInstruction;

    // Update mobile sliders
    mobileTemperatureInput.value = config.temperature;
    mobileTopPInput.value = config.topP;
    mobileTopKInput.value = config.topK;
    mobileSystemInstructionInput.value = config.systemInstruction;

    // Update display values
    tempValue.textContent = config.temperature;
    toppValue.textContent = config.topP;
    topkValue.textContent = config.topK;
    mobileTempValue.textContent = config.temperature;
    mobileToppValue.textContent = config.topP;
    mobileTopkValue.textContent = config.topK;

    // Update local state
    systemInstruction = config.systemInstruction;
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
}

// ====== SAVE CONFIGURATION TO SERVER ======
async function saveConfigurationToServer() {
  try {
    const config = {
      temperature: parseFloat(temperatureInput.value),
      topP: parseFloat(topPInput.value),
      topK: parseInt(topKInput.value),
      systemInstruction: systemInstructionInput.value
    };

    const response = await fetch('/api/save-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      console.error('Failed to save configuration');
      return;
    }

    const data = await response.json();
    console.log('✅ Configuration saved to server:', data.config);
  } catch (error) {
    console.error('Error saving configuration:', error);
  }
}

// ====== SAVE SYSTEM INSTRUCTION ======
function saveSystemInstruction(text) {
  systemInstruction = text;
  localStorage.setItem('systemInstruction', text);
}

// ====== SAVE API KEY ======
function saveApiKey(text) {
  apiKey = text;
  localStorage.setItem('geminiApiKey', text);
  updateApiStatus();
}

// ====== UPDATE API KEY STATUS ======
function updateApiStatus() {
  if (apiKey && apiKey.trim().length > 0) {
    apiStatus.innerHTML = '✅ API Key Set';
    apiStatus.className = 'text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-semibold';
    mobileApiStatus.innerHTML = '✅ API Key Set';
    mobileApiStatus.className = 'text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-semibold';
  } else {
    apiStatus.innerHTML = '❌ Not Set';
    apiStatus.className = 'text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-semibold';
    mobileApiStatus.innerHTML = '❌ Not Set';
    mobileApiStatus.className = 'text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-semibold';
  }
}

// ====== NEW CHAT ======
function startNewChat() {
  conversation = [];
  chatBox.innerHTML = '<div class="text-center text-gray-500 text-sm"><p>👋 Start a conversation with AI</p></div>';
  input.value = '';
  input.focus();
  mobilePanel.classList.add('hidden');
}

// ====== RENDER HISTORY LIST ======
function renderHistoryList() {
  const historyHtml = chatHistory.length === 0 
    ? '<p class="text-xs text-gray-500">No history yet</p>'
    : chatHistory.map((chat, index) => `
        <button 
          class="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs truncate transition"
          onclick="loadChatHistory(${chat.id})"
        >
          ${chat.preview}
        </button>
      `).join('');
  
  historyList.innerHTML = historyHtml;
  mobileHistoryList.innerHTML = historyHtml;
}

// ====== LOAD CHAT FROM HISTORY ======
function loadChatHistory(chatId) {
  const chat = chatHistory.find(c => c.id === chatId);
  if (chat) {
    conversation = [...chat.conversation];
    chatBox.innerHTML = '';
    conversation.forEach(msg => {
      appendMessage(msg.role === 'user' ? 'user' : 'bot', msg.text);
    });
    mobilePanel.classList.add('hidden');
  }
}

// ====== SAVE CHAT TO HISTORY ======
function saveChatToHistory() {
  const timestamp = new Date().toLocaleString();
  const preview = conversation.length > 0 ? conversation[0].text.substring(0, 30) + '...' : 'Empty chat';
  chatHistory.push({
    id: Date.now(),
    timestamp,
    preview,
    conversation: [...conversation]
  });
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  renderHistoryList();
}

// ====== CLEAR HISTORY ======
clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all history?')) {
    chatHistory = [];
    localStorage.removeItem('chatHistory');
    renderHistoryList();
  }
});

mobileClearHistoryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all history?')) {
    chatHistory = [];
    localStorage.removeItem('chatHistory');
    renderHistoryList();
  }
});

// ====== NEW CHAT ======
newChatBtn.addEventListener('click', startNewChat);
mobileNewChatBtn.addEventListener('click', startNewChat);

// ====== SYSTEM INSTRUCTION LISTENERS ======
systemInstructionInput.addEventListener('input', (e) => {
  saveSystemInstruction(e.target.value);
  mobileSystemInstructionInput.value = e.target.value;
  saveConfigurationToServer(); // Auto-save to server
});

mobileSystemInstructionInput.addEventListener('input', (e) => {
  saveSystemInstruction(e.target.value);
  systemInstructionInput.value = e.target.value;
  saveConfigurationToServer(); // Auto-save to server
});

// ====== API KEY LISTENERS ======
apiKeyInput.addEventListener('input', (e) => {
  saveApiKey(e.target.value);
  mobileApiKeyInput.value = e.target.value;
});

mobileApiKeyInput.addEventListener('input', (e) => {
  saveApiKey(e.target.value);
  apiKeyInput.value = e.target.value;
});

// ====== SUBMIT API KEY WITH FEEDBACK ======
async function submitApiKeyWithFeedback(submitBtn) {
  const apiKeyValue = submitBtn.id === 'api-key-submit' ? apiKeyInput.value : mobileApiKeyInput.value;
  
  if (!apiKeyValue || apiKeyValue.trim().length === 0) {
    alert('⚠️ Please enter an API key');
    return;
  }

  try {
    // Send API key to backend to update .env
    const response = await fetch('/api/update-env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: apiKeyValue })
    });

    const data = await response.json();

    if (!response.ok) {
      alert('⚠️ Failed to update API key on server: ' + data.error);
      return;
    }

    // Save API key locally
    saveApiKey(apiKeyValue);
    
    // Show visual feedback
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✓ Saved!';
    submitBtn.classList.add('bg-green-600');
    submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('bg-green-600');
      submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    }, 2000);
  } catch (error) {
    console.error('Error updating API key:', error);
    alert('❌ Error updating API key: ' + error.message);
  }
}

apiKeySubmitBtn.addEventListener('click', () => {
  submitApiKeyWithFeedback(apiKeySubmitBtn);
});

mobileApiKeySubmitBtn.addEventListener('click', () => {
  submitApiKeyWithFeedback(mobileApiKeySubmitBtn);
});

// ====== EXPORT HISTORY ======
exportHistoryBtn.addEventListener('click', () => {
  const dataStr = JSON.stringify(chatHistory, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `chat-history-${Date.now()}.json`;
  link.click();
});

mobileExportHistoryBtn.addEventListener('click', () => {
  const dataStr = JSON.stringify(chatHistory, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `chat-history-${Date.now()}.json`;
  link.click();
});

// ====== UPDATE SLIDER VALUES ======
temperatureInput.addEventListener('input', (e) => {
  tempValue.textContent = e.target.value;
  mobileTemperatureInput.value = e.target.value;
  mobileTempValue.textContent = e.target.value;
  saveConfigurationToServer(); // Auto-save to server
});

topPInput.addEventListener('input', (e) => {
  toppValue.textContent = e.target.value;
  mobileTopPInput.value = e.target.value;
  mobileToppValue.textContent = e.target.value;
  saveConfigurationToServer(); // Auto-save to server
});

topKInput.addEventListener('input', (e) => {
  topkValue.textContent = e.target.value;
  mobileTopKInput.value = e.target.value;
  mobileTopkValue.textContent = e.target.value;
  saveConfigurationToServer(); // Auto-save to server
});

mobileTemperatureInput.addEventListener('input', (e) => {
  mobileTempValue.textContent = e.target.value;
  temperatureInput.value = e.target.value;
  tempValue.textContent = e.target.value;
  saveConfigurationToServer(); // Auto-save to server
});

mobileTopPInput.addEventListener('input', (e) => {
  mobileToppValue.textContent = e.target.value;
  topPInput.value = e.target.value;
  toppValue.textContent = e.target.value;
  saveConfigurationToServer(); // Auto-save to server
});

mobileTopKInput.addEventListener('input', (e) => {
  mobileTopkValue.textContent = e.target.value;
  topKInput.value = e.target.value;
  topkValue.textContent = e.target.value;
  saveConfigurationToServer(); // Auto-save to server
});

// ====== FORM SUBMISSION ======
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Validate API Key
  if (!apiKey || apiKey.trim().length === 0) {
    appendMessage('bot', '❌ Error: Gemini API Key is not set. Please add your API key in Settings first.');
    return;
  }

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  input.focus();

  conversation.push({ role: 'user', text: userMessage });

  loadingEl.classList.remove('hidden');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation,
        config: {
          temperature: parseFloat(temperatureInput.value),
          topP: parseFloat(topPInput.value),
          topK: parseInt(topKInput.value),
          systemInstruction
        },
        apiKey
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const botMessage = data.result;
      appendMessage('bot', botMessage);
      conversation.push({ role: 'model', text: botMessage });
      saveChatToHistory();
    } else {
      appendMessage('bot', `❌ Error: ${data.error}`);
    }
  } catch (error) {
    appendMessage('bot', `❌ Error: ${error.message}`);
  } finally {
    loadingEl.classList.add('hidden');
  }
});

// ====== APPEND MESSAGE ======
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('p-4', 'rounded-lg', 'max-w-md', 'break-words', 'animate-fade-in');
  
  if (sender === 'user') {
    msg.classList.add('message-user', 'ml-auto', 'bg-blue-500', 'text-white');
  } else {
    msg.classList.add('message-bot', 'bg-gray-200', 'text-gray-800');
  }
  
  msg.innerHTML = `<div class="text-sm">${escapeHtml(text)}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ====== INITIALIZE ======
window.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  loadSystemInstruction();
  loadApiKey();
  loadConfigurationFromServer(); // Load saved configuration from server
});

