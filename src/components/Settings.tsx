import React, { useState } from 'react';
import './Settings.css';
import { useNotifications } from '../hooks/useNotifications';

interface SettingsProps {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStart: boolean;
  soundNotifications: boolean;
  onSave: (settings: TimerSettings) => void;
  onClose: () => void;
}

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStart: boolean;
  soundNotifications: boolean;
}

const Settings: React.FC<SettingsProps> = ({
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  sessionsBeforeLongBreak,
  autoStart,
  soundNotifications,
  onSave,
  onClose
}) => {
  const { showNotification } = useNotifications();
  
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: workDuration / 60, // Convert seconds to minutes for display
    shortBreakDuration: shortBreakDuration / 60,
    longBreakDuration: longBreakDuration / 60,
    sessionsBeforeLongBreak,
    autoStart,
    soundNotifications
  });

  const handleInputChange = (field: keyof TimerSettings, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Convert minutes back to seconds before saving
    const settingsInSeconds = {
      ...settings,
      workDuration: settings.workDuration * 60,
      shortBreakDuration: settings.shortBreakDuration * 60,
      longBreakDuration: settings.longBreakDuration * 60,
    };
    onSave(settingsInSeconds);
    onClose();
  };

  const handleReset = () => {
    setSettings({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 20,
      sessionsBeforeLongBreak: 4,
      autoStart: true,
      soundNotifications: true
    });
  };

  const testNotification = () => {
    showNotification({
      title: '🎉 Test Notification',
      body: 'This is how notifications will sound and look!',
      icon: '/favicon.ico',
      playSound: settings.soundNotifications,
      soundType: 'work'
    });
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <label htmlFor="work-duration">
              <span className="setting-icon">🍅</span>
              Work Duration (minutes)
            </label>
            <input
              id="work-duration"
              type="number"
              min="1"
              max="60"
              value={settings.workDuration}
              onChange={(e) => handleInputChange('workDuration', parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="short-break-duration">
              <span className="setting-icon">☕</span>
              Short Break Duration (minutes)
            </label>
            <input
              id="short-break-duration"
              type="number"
              min="1"
              max="30"
              value={settings.shortBreakDuration}
              onChange={(e) => handleInputChange('shortBreakDuration', parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="long-break-duration">
              <span className="setting-icon">🛋️</span>
              Long Break Duration (minutes)
            </label>
            <input
              id="long-break-duration"
              type="number"
              min="5"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) => handleInputChange('longBreakDuration', parseInt(e.target.value) || 5)}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="sessions-before-long-break">
              <span className="setting-icon">🔄</span>
              Sessions Before Long Break
            </label>
            <input
              id="sessions-before-long-break"
              type="number"
              min="2"
              max="8"
              value={settings.sessionsBeforeLongBreak}
              onChange={(e) => handleInputChange('sessionsBeforeLongBreak', parseInt(e.target.value) || 2)}
            />
          </div>

          <div className="setting-group checkbox-group">
            <label htmlFor="auto-start" className="checkbox-label">
              <input
                id="auto-start"
                type="checkbox"
                checked={settings.autoStart}
                onChange={(e) => handleInputChange('autoStart', e.target.checked)}
              />
              <span className="setting-icon">⚡</span>
              Auto-start next session
            </label>
          </div>

          <div className="setting-group checkbox-group">
            <label htmlFor="sound-notifications" className="checkbox-label">
              <input
                id="sound-notifications"
                type="checkbox"
                checked={settings.soundNotifications}
                onChange={(e) => handleInputChange('soundNotifications', e.target.checked)}
              />
              <span className="setting-icon">🔊</span>
              Sound notifications
            </label>
            <button 
              className="test-notification-btn"
              onClick={testNotification}
              type="button"
            >
              🎵 Test Sound
            </button>
          </div>
        </div>

        <div className="settings-footer">
          <button className="control-btn secondary" onClick={handleReset}>
            🔄 Reset to Default
          </button>
          <div className="footer-actions">
            <button className="control-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="control-btn primary" onClick={handleSave}>
              💾 Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
