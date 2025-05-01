/**
 * Data fetching functionality
 */
(function() {
  const API_BASE_URL = '/api'; // Adjust this to your actual backend URL if needed, e.g., 'http://localhost:3000/api'

  /**
   * Fetch dashboard data
   * @returns {Promise<Object>} Dashboard data
   */
  async function fetchDashboardData() {
    try {
        // Mock data
        return {
            stats: [
                { title: "Total Users", value: "5,240", change: "+12%", icon: "fa-users" },
                { title: "Active Threats", value: "182", change: "-8%", icon: "fa-shield-alt" },
                { title: "Security Score", value: "92%", change: "-3%", icon: "fa-lock" },
                { title: "Avg. Response", value: "10m", change: "-2m", icon: "fa-clock" }
            ],
            alertsData: [
                { type: "Critical", time: "10m ago", message: "Potential data breach detected" },
                { type: "Warning", time: "1h ago", message: "Unusual login activity" },
                { type: "Info", time: "3h ago", message: "System scan completed" },
                { type: "Critical", time: "5h ago", message: "DDOS attack attempt blocked" }
            ],
            usersData: [
                { id: 1, name: "Alex Thompson", email: "alex@example.com", role: "Admin", status: "Active" },
                { id: 2, name: "Jamie Rodriguez", email: "jamie@example.com", role: "Moderator", status: "Active" },
                { id: 3, name: "Morgan Lee", email: "morgan@example.com", role: "User", status: "Inactive" },
                { id: 4, name: "Taylor Singh", email: "taylor@example.com", role: "User", status: "Active" }
            ]
        };
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        window.ToastManager?.showToast('Failed to load dashboard data.', 'error');
        return null;
    }
}

  /**
   * Fetch users data
   * @returns {Promise<Array>} Users array
   */
  async function fetchUsers() {
      try {
          const response = await fetch(`${API_BASE_URL}/users`);
          if (!response.ok) {
              throw new Error(`Error fetching users: ${response.statusText}`);
          }
          return await response.json();
      } catch (error) {
          console.error('Failed to fetch users:', error);
          window.ToastManager?.showToast('Failed to load users. Please try again.', 'error');
          return [];
      }
  }

  /**
   * Fetch security metrics
   * @returns {Promise<Array>} Security metrics array
   */
  async function fetchSecurityMetrics() {
      try {
          const response = await fetch(`${API_BASE_URL}/security/metrics`);
          if (!response.ok) {
              throw new Error(`Error fetching security metrics: ${response.statusText}`);
          }
          return await response.json();
      } catch (error) {
          console.error('Failed to fetch security metrics:', error);
          window.ToastManager?.showToast('Failed to load security metrics. Please try again.', 'error');
          return [];
      }
  }

  /**
   * Fetch alerts
   * @returns {Promise<Array>} Alerts array
   */
  async function fetchAlerts() {
      try {
          const response = await fetch(`${API_BASE_URL}/alerts`);
          if (!response.ok) {
              throw new Error(`Error fetching alerts: ${response.statusText}`);
          }
          return await response.json();
      } catch (error) {
          console.error('Failed to fetch alerts:', error);
          window.ToastManager?.showToast('Failed to load alerts. Please try again.', 'error');
          return [];
      }
  }

  /**
   * Fetch device distribution data
   * @returns {Promise<Array>} Device distribution array
   */
  async function fetchDeviceDistribution() {
      try {
          const response = await fetch(`${API_BASE_URL}/security/devices`);
          if (!response.ok) {
              throw new Error(`Error fetching device distribution: ${response.statusText}`);
          }
          return await response.json();
      } catch (error) {
          console.error('Failed to fetch device distribution:', error);
          window.ToastManager?.showToast('Failed to load device distribution. Please try again.', 'error');
          return [];
      }
  }

  /**
   * Fetch threat types data
   * @returns {Promise<Array>} Threat types array
   */
  async function fetchThreatTypes() {
      try {
          const response = await fetch(`${API_BASE_URL}/security/threats`);
          if (!response.ok) {
              throw new Error(`Error fetching threat types: ${response.statusText}`);
          }
          return await response.json();
      } catch (error) {
          console.error('Failed to fetch threat types:', error);
          window.ToastManager?.showToast('Failed to load threat types. Please try again.', 'error');
          return [];
      }
  }

  // Make functions accessible globally
  window.DataFetcher = {
      fetchDashboardData,
      fetchUsers,
      fetchSecurityMetrics,
      fetchAlerts,
      fetchDeviceDistribution,
      fetchThreatTypes
  };
})();