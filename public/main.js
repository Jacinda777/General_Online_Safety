 // Main UI Script
 document.addEventListener('DOMContentLoaded', init);

 let playerState = {
   name: 'Player',
   level: 'Beginner',
   score: 0,
   accuracy: 0,
   hintsRemaining: 3,
   currentLevel: 1,
   scenariosCompleted: 0,
   totalScenarios: 15,
   correctAnswers: 0,
   totalAnswers: 0
 };

 let currentDifficulty = 'beginner';

 function init() {
   setupEventListeners();
   loadPlayerData();
   handleInitialNavigation();
 }

 function setupEventListeners() {
   document.getElementById('mobile-menu').addEventListener('click', toggleNavSidebar);
   document.getElementById('mobile-close').addEventListener('click', toggleRightSidebar);
   
   const navLinks = document.querySelectorAll('.nav-menu a');
   navLinks.forEach(link => {
     link.addEventListener('click', (e) => {
       e.preventDefault();
       const page = link.getAttribute('data-page');
       navigateToPage(page);
     });
   });
   
   const difficultyButtons = document.querySelectorAll('.difficulty-btn');
   difficultyButtons.forEach(button => {
     button.addEventListener('click', () => {
       const difficulty = button.getAttribute('data-difficulty');
       changeDifficulty(difficulty);
     });
   });
   
   document.getElementById('settings-form').addEventListener('submit', handleSettingsSubmit);
   window.addEventListener('hashchange', handleInitialNavigation);
 }

 function toggleNavSidebar() {
   const navSidebar = document.getElementById('nav-sidebar');
   navSidebar.classList.toggle('active');
 }

 function toggleRightSidebar() {
   const rightSidebar = document.getElementById('right-sidebar');
   rightSidebar.classList.toggle('active');
 }

 function navigateToPage(pageName) {
   window.location.hash = pageName;
   
   const navLinks = document.querySelectorAll('.nav-menu a');
   navLinks.forEach(link => {
     link.classList.remove('active');
     if (link.getAttribute('data-page') === pageName) {
       link.classList.add('active');
     }
   });
   
   const pages = document.querySelectorAll('.page');
   pages.forEach(page => {
     page.classList.remove('active');
   });
   
   const targetPage = document.getElementById(`${pageName}-page`);
   if (targetPage) {
     targetPage.classList.add('active');
     updatePageTitle(pageName);
     loadPageData(pageName);
   }
   
   if (window.innerWidth <= 768) {
     toggleNavSidebar();
   }
 }

 function updatePageTitle(pageName) {
   const pageTitle = document.getElementById('page-title');
   switch (pageName) {
     case 'game': pageTitle.textContent = 'Phishing Detection Game'; break;
     case 'learning-center': pageTitle.textContent = 'Learning Center'; break;
     case 'leaderboard': pageTitle.textContent = 'Leaderboard'; break;
     case 'achievements': pageTitle.textContent = 'Achievements'; break;
     case 'settings': pageTitle.textContent = 'Settings'; break;
     default: pageTitle.textContent = 'Phishing Detection Game';
   }
 }

 function handleInitialNavigation() {
   const hash = window.location.hash.substring(1);
   if (hash && hash !== '') {
     navigateToPage(hash);
   } else {
     navigateToPage('game');
   }
 }

 function changeDifficulty(difficulty) {
   currentDifficulty = difficulty;
   const difficultyButtons = document.querySelectorAll('.difficulty-btn');
   difficultyButtons.forEach(button => {
     button.classList.remove('active');
     if (button.getAttribute('data-difficulty') === difficulty) {
       button.classList.add('active');
     }
   });
   const playerLevel = document.getElementById('player-level');
   playerLevel.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
   if (document.getElementById('game-page').classList.contains('active')) {
     loadScenarios(difficulty);
   }
   showToast(`Difficulty changed to ${difficulty}`);
 }

 function loadPageData(pageName) {
   switch (pageName) {
     case 'leaderboard': fetchLeaderboard(); break;
     case 'achievements': fetchAchievements(); break;
     case 'settings': populateSettingsForm(); break;
   }
 }

 function loadPlayerData() {
   const storedPlayerData = localStorage.getItem('playerData');
   if (storedPlayerData) {
     try {
       playerState = JSON.parse(storedPlayerData);
       updatePlayerStatsUI();
     } catch (error) {
       console.error('Error parsing stored player data:', error);
     }
   }
   fetch('/api/player-state')
     .then(response => response.json())
     .then(data => {
       playerState = data;
       updatePlayerStatsUI();
       localStorage.setItem('playerData', JSON.stringify(playerState));
     })
     .catch(error => console.error('Error fetching player state:', error));
 }

 function updatePlayerStatsUI() {
   document.getElementById('player-name').textContent = playerState.name;
   document.getElementById('player-level').textContent = playerState.level.charAt(0).toUpperCase() + playerState.level.slice(1);
   document.getElementById('score').textContent = playerState.score;
   document.getElementById('accuracy').textContent = playerState.accuracy + '%';
   document.getElementById('level').textContent = playerState.currentLevel;
   document.getElementById('hints').textContent = playerState.hintsRemaining;
 }

 function fetchLeaderboard() {
   const leaderboardData = document.getElementById('leaderboard-data');
   leaderboardData.innerHTML = '<tr><td colspan="5" class="text-center">Loading leaderboard data...</td></tr>';
   fetch('/api/leaderboard')
     .then(response => response.json())
     .then(data => updateLeaderboardUI(data))
     .catch(error => {
       console.error('Error fetching leaderboard:', error);
       leaderboardData.innerHTML = '<tr><td colspan="5" class="text-center">Failed to load leaderboard.</td></tr>';
     });
 }

 function updateLeaderboardUI(leaderboardData) {
   const leaderboardElement = document.getElementById('leaderboard-data');
   if (!leaderboardData || leaderboardData.length === 0) {
     leaderboardElement.innerHTML = '<tr><td colspan="5" class="text-center">No leaderboard data available.</td></tr>';
     return;
   }
   let leaderboardHTML = '';
   leaderboardData.forEach((player, index) => {
     leaderboardHTML += `
       <tr>
         <td>${index + 1}</td>
         <td>${player.username}</td>
         <td>${player.score}</td>
         <td>${player.accuracy}%</td>
         <td>${player.currentLevel}</td>
       </tr>
     `;
   });
   leaderboardElement.innerHTML = leaderboardHTML;
 }

 function fetchAchievements() {
   const achievementsGrid = document.getElementById('achievements-grid');
   achievementsGrid.innerHTML = '<div class="text-center">Loading achievements...</div>';
   fetch('/api/achievements')
     .then(response => response.json())
     .then(data => updateAchievementsUI(data))
     .catch(error => {
       console.error('Error fetching achievements:', error);
       achievementsGrid.innerHTML = '<div class="text-center">Failed to load achievements.</div>';
     });
 }

 function updateAchievementsUI(achievementsData) {
   const achievementsGrid = document.getElementById('achievements-grid');
   if (!achievementsData || achievementsData.length === 0) {
     achievementsGrid.innerHTML = '<div class="text-center">No achievements available.</div>';
     return;
   }
   let achievementsHTML = '';
   achievementsData.forEach(achievement => {
     const isUnlocked = playerState.score >= achievement.requiredScore;
     const achievementClass = isUnlocked ? 'achievement-unlocked' : 'achievement-locked';
     const iconClass = achievement.icon || 'fa-trophy';
     achievementsHTML += `
       <div class="achievement-card ${achievementClass}">
         <div class="achievement-icon">
           <i class="fas ${iconClass}"></i>
         </div>
         <div class="achievement-title">${achievement.name}</div>
         <div class="achievement-desc">${achievement.description}</div>
         <div class="achievement-progress">
           ${isUnlocked ? 'Unlocked' : `Requires ${achievement.requiredScore} points`}
         </div>
       </div>
     `;
   });
   achievementsGrid.innerHTML = achievementsHTML;
 }

 function populateSettingsForm() {
   const usernameInput = document.getElementById('username');
   const difficultySelect = document.getElementById('difficulty');
   usernameInput.value = playerState.name;
   difficultySelect.value = playerState.level.toLowerCase();
 }

 function handleSettingsSubmit(e) {
   e.preventDefault();
   const usernameInput = document.getElementById('username');
   const difficultySelect = document.getElementById('difficulty');
   const newName = usernameInput.value.trim();
   const newDifficulty = difficultySelect.value;
   if (newName === '') {
     showToast('Username cannot be empty');
     return;
   }
   if (newName !== playerState.name) {
     updatePlayerName(newName);
   }
   if (newDifficulty !== currentDifficulty) {
     changeDifficulty(newDifficulty);
   }
   showToast('Settings saved successfully');
 }

 function updatePlayerName(name) {
   fetch('/api/player-state/name', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ name })
   })
     .then(response => response.json())
     .then(data => {
       if (data.success) {
         playerState.name = name;
         document.getElementById('player-name').textContent = name;
         localStorage.setItem('playerData', JSON.stringify(playerState));
       }
     })
     .catch(error => console.error('Error updating player name:', error));
 }

 function showToast(message, duration = 3000) {
   const toast = document.getElementById('toast');
   toast.textContent = message;
   toast.classList.add('show');
   setTimeout(() => toast.classList.remove('show'), duration);
 }

 window.navigateToPage = navigateToPage;
 window.showToast = showToast;
 window.playerState = playerState;
 window.changeDifficulty = changeDifficulty;
 window.updatePlayerStatsUI = updatePlayerStatsUI;