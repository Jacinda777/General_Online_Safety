/**
 * Main application logic
 */
(function() {
  // DOM elements
  const statsContainer = document.getElementById('stats-container');
  const alertsContainer = document.getElementById('alerts-container');
  const usersTableBody = document.getElementById('users-table-body');
  const refreshUsersBtn = document.getElementById('refresh-users');
  const toastContainer = document.getElementById('toast-container');
  
  let dashboardData = null;
  
  /**
   * Initialize application
   */
  async function initializeApp() {
      try {
          // Ensure SidebarManager is available
          if (!window.SidebarManager || typeof window.SidebarManager.init !== 'function') {
              console.warn('Waiting for SidebarManager...');
              await new Promise(resolve => {
                  const check = setInterval(() => {
                      if (window.SidebarManager && typeof window.SidebarManager.init === 'function') {
                          clearInterval(check);
                          resolve();
                      }
                  }, 100);
              });
          }
          window.SidebarManager.init();
          
          // Initialize toast manager
          initToastManager();
          
          // Load dashboard data
          await loadDashboardData();
          
          // Set up event listeners
          setupEventListeners();
      } catch (error) {
          console.error('App initialization failed:', error);
          showToast('Application failed to initialize', 'error');
      }
  }
  
  /**
   * Load dashboard data from API
   */
  async function loadDashboardData() {
      showLoadingState();
      
      dashboardData = await window.DataFetcher.fetchDashboardData();
      
      if (dashboardData) {
          renderDashboard(dashboardData);
          showToast('Dashboard data loaded successfully', 'success');
      } else {
          showLoadingError();
      }
  }
  
  /**
   * Show loading state for all components
   */
  function showLoadingState() {
      // Loading state already set in HTML with skeleton loaders
  }
  
  /**
   * Show loading error state
   */
  function showLoadingError() {
      statsContainer.innerHTML = `
          <div class="col-span-full bg-white rounded-lg shadow p-6 border border-border">
              <div class="flex items-center justify-center flex-col gap-2 text-gray-500">
                  <i class="fas fa-exclamation-circle text-security-alert text-2xl"></i>
                  <p>Failed to load dashboard data</p>
                  <button id="retry-load" class="mt-2 px-4 py-2 bg-primary text-white rounded-md">
                      Retry
                  </button>
              </div>
          </div>
      `;
      
      document.getElementById('retry-load').addEventListener('click', loadDashboardData);
  }
  
  /**
   * Render dashboard with data
   * @param {Object} data - Dashboard data
   */
  function renderDashboard(data) {
      renderStats(data.stats);
      renderAlerts(data.alertsData);
      renderUsers(data.usersData);
      
      // Initialize charts
      if (window.ChartManager && typeof window.ChartManager.init === 'function') {
          window.ChartManager.init(data);
      } else {
          console.warn('ChartManager not available');
      }
  }
  
  /**
   * Render statistics cards
   * @param {Array} stats - Array of statistics data
   */
  function renderStats(stats) {
      statsContainer.innerHTML = stats.map((stat, index) => `
          <div class="bg-white rounded-lg shadow p-6 border border-border animate-fade-in" style="animation-delay: ${index * 100}ms">
              <div class="flex justify-between items-start">
                  <div>
                      <p class="text-sm font-medium text-gray-500">${stat.title}</p>
                      <h3 class="text-2xl font-bold mt-1">${stat.value}</h3>
                      <p class="text-xs mt-1 ${stat.change.startsWith('+') ? 'text-security-success' : 'text-security-alert'}">
                          ${stat.change} from last month
                      </p>
                  </div>
                  <div class="p-2 rounded-full bg-primary/10">
                      <i class="fas ${stat.icon} text-primary"></i>
                  </div>
              </div>
          </div>
      `).join('');
  }
  
  /**
   * Render alerts list
   * @param {Array} alerts - Array of alerts data
   */
  function renderAlerts(alerts) {
      alertsContainer.innerHTML = alerts.map(alert => `
          <div class="flex items-start gap-3 p-3 rounded-md border border-gray-200">
              <div class="pt-0.5">
                  <span class="inline-block w-3 h-3 rounded-full ${
                      alert.type === 'Critical' ? 'bg-security-alert' :
                      alert.type === 'Warning' ? 'bg-security-warning' :
                      'bg-primary'
                  }"></span>
              </div>
              <div class="flex-1">
                  <div class="flex justify-between">
                      <p class="font-medium text-sm ${
                          alert.type === 'Critical' ? 'text-security-alert' :
                          alert.type === 'Warning' ? 'text-security-warning' :
                          'text-primary'
                      }">${alert.type}</p>
                      <span class="text-xs text-gray-500">${alert.time}</span>
                  </div>
                  <p class="text-sm text-gray-700 mt-1">${alert.message}</p>
              </div>
          </div>
      `).join('');
  }
  
  /**
   * Render users table
   * @param {Array} users - Array of users data
   */
  function renderUsers(users) {
      usersTableBody.innerHTML = users.map(user => `
          <tr>
              <td class="px-4 py-3">
                  <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          ${user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">${user.name}</div>
                      </div>
                  </div>
              </td>
              <td class="px-4 py-3">
                  <div class="text-sm text-gray-900">${user.email}</div>
              </td>
              <td class="px-4 py-3">
                  <div class="text-sm ${user.role === 'Admin' ? 'text-primary' : 'text-gray-900'}">${user.role}</div>
              </td>
              <td class="px-4 py-3">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }">
                      ${user.status}
                  </span>
              </td>
              <td class="px-4 py-3 text-sm">
                  <button class="text-primary hover:text-primary-dark mr-2" data-id="${user.id}" data-action="edit">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button class="text-gray-500 hover:text-gray-700" data-id="${user.id}" data-action="delete">
                      <i class="fas fa-trash"></i>
                  </button>
              </td>
          </tr>
      `).join('');
      
      // Add event listeners to table actions
      document.querySelectorAll('[data-action]').forEach(button => {
          button.addEventListener('click', function() {
              const userId = this.dataset.id;
              const action = this.dataset.action;
              
              if (action === 'edit') {
                  showToast(`Editing user with ID: ${userId}`, 'info');
              } else if (action === 'delete') {
                  showToast(`Deleting user with ID: ${userId}`, 'warning');
              }
          });
      });
  }
  
  /**
   * Set up event listeners
   */
  function setupEventListeners() {
      if (refreshUsersBtn) {
          refreshUsersBtn.addEventListener('click', async function() {
              this.classList.add('animate-spin');
              
              const users = await window.DataFetcher.fetchUsers();
              
              setTimeout(() => {
                  this.classList.remove('animate-spin');
                  
                  if (users.length > 0) {
                      renderUsers(users);
                      showToast('User data refreshed successfully', 'success');
                  } else {
                      showToast('Failed to refresh user data', 'error');
                  }
              }, 800);
          });
      }
  }
  
  /**
   * Initialize toast notification system
   */
  function initToastManager() {
      window.ToastManager = {
          showToast: showToast
      };
  }
  
  /**
   * Show toast notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {number} duration - Duration in ms
   */
  function showToast(message, type = 'info', duration = 3000) {
      if (!toastContainer) {
          console.error('Toast container not found in DOM');
          return;
      }
      
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icon = type === 'success' ? 'fa-check-circle' :
                   type === 'error' ? 'fa-times-circle' :
                   type === 'warning' ? 'fa-exclamation-circle' :
                   'fa-info-circle';
      
      toast.innerHTML = `
          <i class="fas ${icon} mt-0.5"></i>
          <div class="flex-1">${message}</div>
          <button class="text-white hover:text-gray-200">
              <i class="fas fa-times"></i>
          </button>
      `;
      
      // Animation
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      
      toastContainer.appendChild(toast);
      
      // Trigger reflow
      void toast.offsetWidth;
      
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
      
      // Close button
      toast.querySelector('button').addEventListener('click', () => {
          removeToast(toast);
      });
      
      // Auto-remove after duration
      setTimeout(() => {
          removeToast(toast);
      }, duration);
  }
  
  /**
   * Remove toast notification
   * @param {HTMLElement} toast - Toast element to remove
   */
  function removeToast(toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
          toast.remove();
      }, 300);
  }
  
  // Initialize the application when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', initializeApp);
})();