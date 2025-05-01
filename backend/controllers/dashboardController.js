const User = require('../models/User');
const SecurityMetric = require('../models/SecurityMetric');
const Device = require('../models/device');
const ThreatType = require('../models/ThreatType');
const Alert = require('../models/alert');

const defaultSecurityMetrics = [
  { name: 'Jan', threats: 65, incidents: 28, resolved: 40 },
  { name: 'Feb', threats: 59, incidents: 48, resolved: 38 },
  { name: 'Mar', threats: 80, incidents: 40, resolved: 70 },
  { name: 'Apr', threats: 81, incidents: 40, resolved: 63 },
  { name: 'May', threats: 56, incidents: 36, resolved: 50 },
  { name: 'Jun', threats: 55, incidents: 27, resolved: 40 },
  { name: 'Jul', threats: 40, incidents: 24, resolved: 35 },
];

const defaultDeviceData = [
  { name: 'Mobile', value: 400 },
  { name: 'Desktop', value: 300 },
  { name: 'Tablet', value: 200 },
  { name: 'IoT', value: 100 }
];

const defaultThreatTypesData = [
  { name: 'Phishing', value: 35 },
  { name: 'Malware', value: 25 },
  { name: 'Data Breach', value: 15 },
  { name: 'Social Eng.', value: 25 }
];

const defaultAlertsData = [
  { id: 1, type: 'Critical', message: 'Potential data breach detected', time: '10 minutes ago' },
  { id: 2, type: 'Warning', message: 'Unusual login activity from new location', time: '1 hour ago' },
  { id: 3, type: 'Info', message: 'System scan completed', time: '3 hours ago' },
  { id: 4, type: 'Critical', message: 'DDoS attack attempt blocked', time: '5 hours ago' },
];

const defaultUsersData = [
  { id: 1, name: 'Alex Thompson', email: 'alex@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jamie Rodriguez', email: 'jamie@example.com', role: 'Moderator', status: 'Active' },
  { id: 3, name: 'Morgan Lee', email: 'morgan@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Taylor Singh', email: 'taylor@example.com', role: 'User', status: 'Active' },
];

const dashboardController = {
  getDashboard: async (req, res) => { // Renamed from getDashboardData
    try {
      let totalUsers = 0;
      let securityMetrics = [];
      let deviceData = [];
      let threatTypes = [];
      let alerts = [];
      let users = [];

      try {
        totalUsers = await User.countDocuments();
        securityMetrics = await SecurityMetric.find()
          .sort({ year: 1, month: 1 })
          .limit(7);
        deviceData = await Device.aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } },
          { $project: { _id: 0, name: '$_id', value: '$count' } }
        ]);
        threatTypes = await ThreatType.find().select('name value');
        alerts = await Alert.find({ resolved: false })
          .sort({ timestamp: -1 })
          .limit(4);
        users = await User.find()
          .sort({ createdAt: -1 })
          .limit(4)
          .select('name email role status');
      } catch (dbError) {
        console.error('Error fetching data from MongoDB:', dbError.message);
        console.log('Using default data instead');
      }

      const stats = [
        { title: "Total Users", value: totalUsers ? totalUsers.toString() : "5,240", icon: "fa-users", change: "+12%" },
        { title: "Active Threats", value: "182", icon: "fa-exclamation-triangle", change: "-8%" },
        { title: "Security Score", value: "92%", icon: "fa-shield-alt", change: "+3%" },
        { title: "Avg. Response", value: "10m", icon: "fa-bolt", change: "-2m" }
      ];

      if (deviceData.length === 0) deviceData = defaultDeviceData;
      let threatTypesData = threatTypes.length > 0 ? threatTypes : defaultThreatTypesData;
      const alertsData = alerts.length > 0 
        ? alerts.map(alert => ({
            id: alert._id,
            type: alert.type,
            message: alert.message,
            time: alert.formattedTime
          })) 
        : defaultAlertsData;
      const usersData = users.length > 0 
        ? users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
          })) 
        : defaultUsersData;
      if (securityMetrics.length === 0) securityMetrics = defaultSecurityMetrics;

      const dashboardData = {
        stats,
        securityMetrics,
        deviceData,
        threatTypes: threatTypesData,
        alertsData,
        usersData
      };

      res.status(200).json(dashboardData);
    } catch (error) {
      console.error('Dashboard data error:', error);
      const dashboardData = {
        stats: [
          { title: "Total Users", value: "5,240", icon: "fa-users", change: "+12%" },
          { title: "Active Threats", value: "182", icon: "fa-exclamation-triangle", change: "-8%" },
          { title: "Security Score", value: "92%", icon: "fa-shield-alt", change: "+3%" },
          { title: "Avg. Response", value: "10m", icon: "fa-bolt", change: "-2m" }
        ],
        securityMetrics: defaultSecurityMetrics,
        deviceData: defaultDeviceData,
        threatTypes: defaultThreatTypesData,
        alertsData: defaultAlertsData,
        usersData: defaultUsersData
      };
      res.status(200).json(dashboardData);
    }
  }
};

module.exports = dashboardController;


// const User = require('../models/User');
// const Alert = require('../models/Alert');
// const SecurityMetric = require('../models/SecurityMetric');
// const Device = require('../models/Device');
// const Threat = require('../models/Threat');

// exports.getDashboardData = async (req, res) => {
//     try {
//         const usersCount = await User.countDocuments();
//         const activeThreats = await Threat.aggregate([{ $group: { _id: null, total: { $sum: '$count' } } }]);
//         const latestMetrics = await SecurityMetric.find().sort({ month: -1 }).limit(1);
//         const alerts = await Alert.find().sort({ _id: -1 }).limit(4);

//         const stats = [
//             { title: 'Total Users', value: usersCount.toString(), change: '+12%', icon: 'fa-users' },
//             { title: 'Active Threats', value: activeThreats[0]?.total.toString() || '0', change: '-8%', icon: 'fa-shield-alt' },
//             { title: 'Security Score', value: latestMetrics[0] ? `${Math.round((latestMetrics[0].resolved / (latestMetrics[0].threats + latestMetrics[0].incidents)) * 100)}%` : '0%', change: '-3%', icon: 'fa-lock' },
//             { title: 'Avg. Response', value: '10m', change: '-2m', icon: 'fa-clock' },
//         ];

//         const dashboardData = {
//             stats,
//             alertsData: alerts,
//             usersData: await User.find().limit(4),
//         };

//         res.json(dashboardData);
//     } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };
