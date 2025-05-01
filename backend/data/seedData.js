const mongoose = require('mongoose');
const User = require('../models/User');
const Alert = require('./models/alert');
const SecurityMetric = require('../models/SecurityMetric');
const Device = require('./models/device');
const Threat = require('../models/ThreatType');

mongoose.connect('mongodb://localhost:27017/admin_dashboard')
.then(async () => {
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing data
    await User.deleteMany({});
    await Alert.deleteMany({});
    await SecurityMetric.deleteMany({});
    await Device.deleteMany({});
    await Threat.deleteMany({});

    // Seed Users
    const users = [
        { name: 'Alex Thompson', email: 'alex@example.com', role: 'Admin', status: 'Active' },
        { name: 'Jamie Rodriguez', email: 'jamie@example.com', role: 'Admin', status: 'Active' },
        { name: 'Morgan Lee', email: 'morgan@example.com', role: 'User', status: 'Inactive' },
        { name: 'Taylor Singh', email: 'taylor@example.com', role: 'User', status: 'Active' },
    ];
    await User.insertMany(users);

    // Seed Alerts
    const alerts = [
        { type: 'Critical', message: 'Potential data breach detected', time: '10m ago' },
        { type: 'Warning', message: 'Unusual login activity', time: '1h ago' },
        { type: 'Info', message: 'System scan completed', time: '3h ago' },
        { type: 'Critical', message: 'DDOS attack attempt blocked', time: '5h ago' },
    ];
    await Alert.insertMany(alerts);

    // Seed Security Metrics
    const metrics = [
        { month: 'Jan', threats: 60, incidents: 40, resolved: 50 },
        { month: 'Feb', threats: 50, incidents: 50, resolved: 40 },
        { month: 'Mar', threats: 70, incidents: 40, resolved: 60 },
        { month: 'Apr', threats: 60, incidents: 40, resolved: 50 },
        { month: 'May', threats: 50, incidents: 30, resolved: 40 },
        { month: 'Jun', threats: 40, incidents: 30, resolved: 30 },
    ];
    await SecurityMetric.insertMany(metrics);

    // Seed Devices
    const devices = [
        { type: 'Mobile', count: 40 },
        { type: 'Desktop', count: 30 },
        { type: 'Tablet', count: 20 },
        { type: 'IoT', count: 10 },
    ];
    await Device.insertMany(devices);

    // Seed Threats
    const threats = [
        { type: 'Phishing', count: 35 },
        { type: 'Malware', count: 25 },
        { type: 'Data Breach', count: 20 },
        { type: 'Social Eng.', count: 20 },
    ];
    await Threat.insertMany(threats);

    console.log('Database seeded successfully');
    mongoose.connection.close();
})
.catch(err => {
    console.error('Seeding error:', err);
    mongoose.connection.close();
});




























// /**
//  * Seed data for MongoDB collections
//  */
// import User from '../models/user.js';
// import SecurityMetric from '../models/SecurityMetric.js';
// import Alert from '../models/alert.js';
// import Device from '../models/device.js';
// import ThreatType from '../models/ThreatType.js';

// /**
//  * Seed initial data to the database
//  */
// export const seedData = async () => {
//   try {
//     console.log('Seeding database...');
    
//     // Seed users if none exist
//     const userCount = await User.countDocuments();
//     if (userCount === 0) {
//       console.log('Seeding users...');
//       await User.create([
//         {
//           name: 'Alex Thompson',
//           email: 'alex@example.com',
//           role: 'Admin',
//           status: 'Active',
//           password: 'password123' // In a real app, this would be hashed
//         },
//         {
//           name: 'Jamie Rodriguez',
//           email: 'jamie@example.com',
//           role: 'Moderator',
//           status: 'Active',
//           password: 'password123'
//         },
//         {
//           name: 'Morgan Lee',
//           email: 'morgan@example.com',
//           role: 'User',
//           status: 'Inactive',
//           password: 'password123'
//         },
//         {
//           name: 'Taylor Singh',
//           email: 'taylor@example.com',
//           role: 'User',
//           status: 'Active',
//           password: 'password123'
//         }
//       ]);
//     }
    
//     // Seed security metrics if none exist
//     const metricCount = await SecurityMetric.countDocuments();
//     if (metricCount === 0) {
//       console.log('Seeding security metrics...');
      
//       // Get current month and year
//       const currentDate = new Date();
//       const currentYear = currentDate.getFullYear();
//       const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      
//       // Generate data for the past 7 months
//       const metrics = [];
//       for (let i = 0; i < 7; i++) {
//         let month = currentMonth - i;
//         let year = currentYear;
        
//         if (month <= 0) {
//           month += 12;
//           year -= 1;
//         }
        
//         const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' });
        
//         metrics.push({
//           name: monthName,
//           threats: Math.floor(Math.random() * 50) + 40,
//           incidents: Math.floor(Math.random() * 30) + 20,
//           resolved: Math.floor(Math.random() * 40) + 30,
//           month,
//           year
//         });
//       }
      
//       await SecurityMetric.create(metrics.reverse()); // Reverse to get chronological order
//     }
    
//     // Seed threat types if none exist
//     const threatCount = await ThreatType.countDocuments();
//     if (threatCount === 0) {
//       console.log('Seeding threat types...');
//       await ThreatType.create([
//         {
//           name: 'Phishing',
//           description: 'Fraudulent attempts to obtain sensitive information by disguising as a trustworthy entity',
//           severity: 'High',
//           value: 35,
//           color: '#ef4444'
//         },
//         {
//           name: 'Malware',
//           description: 'Software designed to disrupt, damage, or gain unauthorized access to computer systems',
//           severity: 'Critical',
//           value: 25,
//           color: '#f59e0b'
//         },
//         {
//           name: 'Data Breach',
//           description: 'Security incident where sensitive data is copied, transmitted, or stolen',
//           severity: 'Critical',
//           value: 15,
//           color: '#3b82f6'
//         },
//         {
//           name: 'Social Engineering',
//           description: 'Psychological manipulation of people into performing actions or divulging confidential information',
//           severity: 'Medium',
//           value: 25,
//           color: '#8b5cf6'
//         }
//       ]);
//     }
    
//     // Seed devices if none exist
//     const deviceCount = await Device.countDocuments();
//     if (deviceCount === 0) {
//       console.log('Seeding devices...');
      
//       // Get user IDs for reference
//       const users = await User.find().select('_id');
      
//       const devices = [
//         { name: 'iPhone 12', type: 'Mobile', securityScore: 95 },
//         { name: 'Samsung Galaxy S21', type: 'Mobile', securityScore: 92 },
//         { name: 'iPad Pro', type: 'Tablet', securityScore: 88 },
//         { name: 'Dell XPS 15', type: 'Desktop', securityScore: 90 },
//         { name: 'MacBook Pro', type: 'Desktop', securityScore: 94 },
//         { name: 'Lenovo ThinkPad', type: 'Desktop', securityScore: 91 },
//         { name: 'Amazon Echo', type: 'IoT', securityScore: 82 },
//         { name: 'Smart Thermostat', type: 'IoT', securityScore: 78 }
//       ];
      
//       // Assign random users to devices
//       const devicesWithUsers = devices.map(device => {
//         const randomUserIdx = Math.floor(Math.random() * users.length);
//         return {
//           ...device,
//           owner: users[randomUserIdx]._id
//         };
//       });
      
//       await Device.create(devicesWithUsers);
//     }
    
//     // Seed alerts if none exist
//     const alertCount = await Alert.countDocuments();
//     if (alertCount === 0) {
//       console.log('Seeding alerts...');
      
//       // Get users, devices, and threat types for reference
//       const users = await User.find().select('_id');
//       const devices = await Device.find().select('_id');
//       const threatTypes = await ThreatType.find().select('_id');
      
//       // Create alerts with timestamps spread over the last 24 hours
//       const now = new Date();
      
//       const alertData = [
//         {
//           type: 'Critical',
//           message: 'Potential data breach detected',
//           timestamp: new Date(now.getTime() - 10 * 60000), // 10 minutes ago
//           affectedUsers: [users[0]._id],
//           affectedDevices: [devices[0]._id],
//           relatedThreat: threatTypes.find(t => t.name === 'Data Breach')._id
//         },
//         {
//           type: 'Warning',
//           message: 'Unusual login activity from new location',
//           timestamp: new Date(now.getTime() - 60 * 60000), // 1 hour ago
//           affectedUsers: [users[1]._id],
//           affectedDevices: [devices[1]._id],
//           relatedThreat: threatTypes.find(t => t.name === 'Social Engineering')._id
//         },
//         {
//           type: 'Info',
//           message: 'System scan completed',
//           timestamp: new Date(now.getTime() - 3 * 60 * 60000), // 3 hours ago
//           affectedUsers: [],
//           affectedDevices: []
//         },
//         {
//           type: 'Critical',
//           message: 'DDoS attack attempt blocked',
//           timestamp: new Date(now.getTime() - 5 * 60 * 60000), // 5 hours ago
//           affectedUsers: [],
//           affectedDevices: [devices[5]._id],
//           relatedThreat: threatTypes.find(t => t.name === 'Malware')._id
//         }
//       ];
      
//       await Alert.create(alertData);
//     }
    
//     console.log('Database seeding completed successfully!');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   }
// };

// export default { seedData };
