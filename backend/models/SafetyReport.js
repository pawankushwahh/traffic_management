const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SafetyReport extends Model {}

SafetyReport.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'JSON object containing latitude and longitude'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  justHappened: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  audioUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  audioAnalysis: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Results from AI audio processing'
  },
  vehicleDetails: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  cctvFootageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'resolved'),
    defaultValue: 'pending'
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'SafetyReport',
  tableName: 'safety_reports',
  timestamps: true
});

module.exports = SafetyReport;
