const Alert = require('../models/alert'); // Assuming you have an Alert model defined in models/Alert.js

const alertController = {
  getAllAlerts: async (req, res) => {
    try {
      const alerts = await Alert.find()
        .sort({ timestamp: -1 })
        .populate('affectedUsers', 'name email')
        .populate('affectedDevices', 'name type')
        .populate('relatedThreat', 'name severity');
      
      res.status(200).json(alerts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching alerts', error: error.message });
    }
  },
  
  getRecentAlerts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 4;
      
      const alerts = await Alert.find({ resolved: false })
        .sort({ timestamp: -1 })
        .limit(limit);
      
      // Format the alerts for the dashboard
      const formattedAlerts = alerts.map(alert => ({
        id: alert._id,
        type: alert.type,
        message: alert.message,
        time: alert.formattedTime
      }));
      
      res.status(200).json(formattedAlerts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recent alerts', error: error.message });
    }
  },
  
  getAlertById: async (req, res) => {
    try {
      const alert = await Alert.findById(req.params.id)
        .populate('affectedUsers', 'name email')
        .populate('affectedDevices', 'name type')
        .populate('relatedThreat', 'name severity');
      
      if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
      }
      
      res.status(200).json(alert);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching alert', error: error.message });
    }
  },
  
  createAlert: async (req, res) => {
    try {
      const { type, message, affectedUsers, affectedDevices, relatedThreat } = req.body;

      // Input validation
      if (!type || !message) {
        return res.status(400).json({ message: 'Type and message are required' });
      }
      if (affectedUsers && !Array.isArray(affectedUsers)) {
        return res.status(400).json({ message: 'affectedUsers must be an array' });
      }

      const alert = await Alert.create({
        type,
        message,
        affectedUsers: affectedUsers || [],
        affectedDevices: affectedDevices || [],
        relatedThreat,
      });

      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ message: 'Error creating alert', error: error.message });
    }
  },

  updateAlert: async (req, res) => {
    try {
      const { type, message, resolved, resolvedAt, affectedUsers, affectedDevices, relatedThreat } = req.body;

      const alert = await Alert.findById(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
      }

      // Update fields with validation
      if (type) alert.type = type;
      if (message) alert.message = message;
      if (resolved !== undefined) {
        if (typeof resolved !== 'boolean') {
          return res.status(400).json({ message: 'Resolved must be a boolean' });
        }
        alert.resolved = resolved;
        if (resolved && !alert.resolvedAt) {
          alert.resolvedAt = resolvedAt || new Date();
        } else if (!resolved) {
          alert.resolvedAt = null;
        }
      }
      if (affectedUsers) {
        if (!Array.isArray(affectedUsers)) {
          return res.status(400).json({ message: 'affectedUsers must be an array' });
        }
        alert.affectedUsers = affectedUsers;
      }
      if (affectedDevices) alert.affectedDevices = affectedDevices;
      if (relatedThreat) alert.relatedThreat = relatedThreat;

      await alert.save();

      res.status(200).json(alert);
    } catch (error) {
      res.status(500).json({ message: 'Error updating alert', error: error.message });
    }
  },

deleteAlert: (req, res) => {
  const alertId = req.params.id;
  // Delete logic here
  res.status(200).json({ message: `Alert ${alertId} deleted` });
}
};

module.exports = alertController;