const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/traffic_dashboard', {
  dialect: 'postgres',
  ssl: process.env.NODE_ENV === 'production',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

const TrafficDensity = sequelize.define('TrafficDensity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  density: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false
  },
  vehicleCount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

const SignalStatus = sequelize.define('SignalStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  intersection: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('red', 'yellow', 'green'),
    allowNull: false
  },
  timer: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  waitTime: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = {
  sequelize,
  TrafficDensity,
  SignalStatus
};
