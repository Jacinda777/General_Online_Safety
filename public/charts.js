// /**
//  * Chart rendering functionality
//  */
// (function() {
//     let securityMetricsChart = null;
//     let deviceDistributionChart = null;
//     let threatTypesChart = null;
  
//     /**
//      * Initialize chart instances
//      * @param {Object} data - Dashboard data containing metrics for charts
//      */
//     function initializeCharts(data) {
//       renderSecurityMetricsChart(data.securityMetrics);
//       renderDeviceDistributionChart(data.deviceData);
//       renderThreatTypesChart(data.threatTypes);
//     }
  
//     /**
//      * Render line chart for security metrics
//      * @param {Array} securityMetrics - Array of security metrics data
//      */
//     function renderSecurityMetricsChart(securityMetrics) {
//       const ctx = document.getElementById('lineChart').getContext('2d');
      
//       // Destroy existing chart if it exists
//       if (securityMetricsChart) {
//         securityMetricsChart.destroy();
//       }
      
//       securityMetricsChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//           labels: securityMetrics.map(item => item.name),
//           datasets: [
//             {
//               label: 'Threats',
//               data: securityMetrics.map(item => item.threats),
//               borderColor: '#ef4444',
//               backgroundColor: 'rgba(239, 68, 68, 0.1)',
//               borderWidth: 2,
//               tension: 0.1
//             },
//             {
//               label: 'Incidents',
//               data: securityMetrics.map(item => item.incidents),
//               borderColor: '#f59e0b',
//               backgroundColor: 'rgba(245, 158, 11, 0.1)',
//               borderWidth: 2,
//               tension: 0.1
//             },
//             {
//               label: 'Resolved',
//               data: securityMetrics.map(item => item.resolved),
//               borderColor: '#10b981',
//               backgroundColor: 'rgba(16, 185, 129, 0.1)',
//               borderWidth: 2,
//               tension: 0.1
//             }
//           ]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               position: 'top',
//             },
//             tooltip: {
//               enabled: true,
//               mode: 'index',
//               intersect: false
//             }
//           },
//           scales: {
//             y: {
//               beginAtZero: true,
//               grid: {
//                 color: 'rgba(156, 163, 175, 0.1)'
//               }
//             },
//             x: {
//               grid: {
//                 display: false
//               }
//             }
//           }
//         }
//       });
//     }
  
//     /**
//      * Render pie chart for device distribution
//      * @param {Array} deviceData - Array of device distribution data
//      */
//     function renderDeviceDistributionChart(deviceData) {
//       const ctx = document.getElementById('pieChart').getContext('2d');
      
//       // Destroy existing chart if it exists
//       if (deviceDistributionChart) {
//         deviceDistributionChart.destroy();
//       }
      
//       deviceDistributionChart = new Chart(ctx, {
//         type: 'pie',
//         data: {
//           labels: deviceData.map(item => item.name),
//           datasets: [{
//             data: deviceData.map(item => item.value),
//             backgroundColor: [
//               '#3b82f6',
//               '#10b981',
//               '#f59e0b',
//               '#6366f1'
//             ],
//             borderWidth: 1
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               position: 'right',
//             }
//           }
//         }
//       });
//     }
  
//     /**
//      * Render doughnut chart for threat types
//      * @param {Array} threatTypes - Array of threat types data
//      */
//     function renderThreatTypesChart(threatTypes) {
//       const ctx = document.getElementById('doughnutChart').getContext('2d');
      
//       // Destroy existing chart if it exists
//       if (threatTypesChart) {
//         threatTypesChart.destroy();
//       }
      
//       threatTypesChart = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//           labels: threatTypes.map(item => item.name),
//           datasets: [{
//             data: threatTypes.map(item => item.value),
//             backgroundColor: [
//               '#ef4444',
//               '#f59e0b',
//               '#3b82f6',
//               '#8b5cf6'
//             ],
//             borderWidth: 1
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: {
//               position: 'right',
//             }
//           },
//           cutout: '60%'
//         }
//       });
//     }
  
//     /**
//      * Update chart data
//      * @param {string} chartId - ID of the chart to update
//      * @param {Array} newData - New data for the chart
//      */
//     function updateChartData(chartId, newData) {
//       if (chartId === 'securityMetrics' && securityMetricsChart) {
//         renderSecurityMetricsChart(newData);
//       } else if (chartId === 'deviceData' && deviceDistributionChart) {
//         renderDeviceDistributionChart(newData);
//       } else if (chartId === 'threatTypes' && threatTypesChart) {
//         renderThreatTypesChart(newData);
//       }
//     }
  
//     // Make functions accessible globally
//     window.ChartManager = {
//       init: initializeCharts,
//       updateChartData: updateChartData
//     };
//   })();
  







// charts.js
window.ChartManager = {
  init: function(data) {
      // Security Metrics Line Chart
      const securityMetricsChart = new Chart(document.getElementById('securityMetricsChart'), {
          type: 'line',
          data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                  {
                      label: 'Threats',
                      data: [60, 50, 70, 60, 50, 40],
                      borderColor: '#FF6B6B',
                      fill: false
                  },
                  {
                      label: 'Incidents',
                      data: [40, 50, 40, 40, 30, 30],
                      borderColor: '#FFB946',
                      fill: false
                  },
                  {
                      label: 'Resolved',
                      data: [50, 40, 60, 50, 40, 30],
                      borderColor: '#4ECDC4',
                      fill: false
                  }
              ]
          },
          options: {
              responsive: true,
              scales: {
                  y: { beginAtZero: true }
              }
          }
      });

      // Device Distribution Pie Chart
      const deviceDistributionChart = new Chart(document.getElementById('deviceDistributionChart'), {
          type: 'pie',
          data: {
              labels: ['Mobile', 'Desktop', 'Tablet', 'IoT'],
              datasets: [{
                  data: [40, 30, 20, 10],
                  backgroundColor: ['#4ECDC4', '#45B7D1', '#FFB946', '#A29BFE']
              }]
          },
          options: { responsive: true }
      });

      // Threat Types Donut Chart
      const threatTypesChart = new Chart(document.getElementById('threatTypesChart'), {
          type: 'doughnut',
          data: {
              labels: ['Phishing', 'Malware', 'Data Breach', 'Social Eng.'],
              datasets: [{
                  data: [35, 25, 20, 20],
                  backgroundColor: ['#FF6B6B', '#FFB946', '#45B7D1', '#A29BFE']
              }]
          },
          options: { responsive: true }
      });
  }
};