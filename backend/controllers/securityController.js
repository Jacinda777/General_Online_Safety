const SecurityMetric = require('../models/SecurityMetric.js');
const Device = require('../models/device.js');
const ThreatType = require('../models/ThreatType.js');
const User = require('../models/User.js');


/**
 * Security controller for handling security metrics and analytics
 */
const securityController = {
  /**
   * Get security metrics for the dashboard
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSecurityMetrics: async (req, res) => {
    try {
      const securityMetrics = await SecurityMetric.find()
        .sort({ year: 1, month: 1 })
        .limit(7);
      
      res.status(200).json(securityMetrics);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching security metrics', error: error.message });
    }
  },
  
  /**
   * Get device distribution data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getDeviceDistribution: async (req, res) => {
    try {
      const deviceCounts = await Device.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: '$count'
          }
        }
      ]);
      
      res.status(200).json(deviceCounts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching device distribution', error: error.message });
    }
  },
  
  /**
   * Get threat types distribution
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getThreatTypes: async (req, res) => {
    try {
      const threatTypes = await ThreatType.find().select('name value color');
      res.status(200).json(threatTypes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching threat types', error: error.message });
    }
  },
  
  /**
   * Update security metrics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateSecurityMetrics: async (req, res) => {
    try {
      const { name, threats, incidents, resolved, month, year } = req.body;
      
      // Find existing metric or create new one
      let securityMetric = await SecurityMetric.findOne({ month, year });
      
      if (securityMetric) {
        // Update existing metric
        securityMetric.name = name || securityMetric.name;
        securityMetric.threats = threats !== undefined ? threats : securityMetric.threats;
        securityMetric.incidents = incidents !== undefined ? incidents : securityMetric.incidents;
        securityMetric.resolved = resolved !== undefined ? resolved : securityMetric.resolved;
        
        await securityMetric.save();
      } else {
        // Create new metric
        securityMetric = await SecurityMetric.create({
          name,
          threats,
          incidents,
          resolved,
          month,
          year
        });
      }
      
      res.status(200).json(securityMetric);
    } catch (error) {
      res.status(500).json({ message: 'Error updating security metrics', error: error.message });
    }
  },
  
  /**
   * Get security overview statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSecurityStats: async (req, res) => {
    try {
      // Get total users
      const totalUsers = await User.countDocuments();
      
      // Get active threats
      const activeThreats = await ThreatType.aggregate([
        { $group: { _id: null, total: { $sum: '$value' } } }
      ]);
      
      const threatCount = activeThreats.length > 0 ? activeThreats[0].total : 0;
      
      // Get security score (calculate based on metrics for the latest month)
      const latestMetric = await SecurityMetric.findOne().sort({ year: -1, month: -1 });
      
      let securityScore = 0;
      let responseTime = 0;
      
      if (latestMetric) {
        // Calculate security score as percentage of resolved threats
        const resolvedPercentage = latestMetric.threats > 0
          ? Math.round((latestMetric.resolved / latestMetric.threats) * 100)
          : 100;
        
        securityScore = resolvedPercentage;
        
        // Mock response time (would come from a different source in a real app)
        responseTime = "10m";
      }
      
      // Calculate change percentages (mock data for demo)
      const userChange = "+12%";
      const threatChange = "-8%";
      const scoreChange = "+3%";
      const responseChange = "-2m";
      
      const stats = [
        { title: "Total Users", value: totalUsers.toLocaleString(), icon: "fa-users", change: userChange },
        { title: "Active Threats", value: threatCount.toString(), icon: "fa-exclamation-triangle", change: threatChange },
        { title: "Security Score", value: `${securityScore}%`, icon: "fa-shield-alt", change: scoreChange },
        { title: "Avg. Response", value: responseTime, icon: "fa-bolt", change: responseChange }
      ];
      
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching security stats', error: error.message });
    }
  }
};

module.exports = securityController;
