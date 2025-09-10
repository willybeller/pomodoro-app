import React, { useState, useEffect, useCallback } from 'react';
import './PomodoroTimer.css';
import Settings, { TimerSettings } from './Settings';

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  currentSession: number;
  sessionType: 'work' | 'shortBreak' | 'longBreak';
  autoStartCountdown: number;
  isSessionComplete: boolean;
}

const DEFAULT_WORK_TIME = 25 * 60; // 25 minutes in seconds
const DEFAULT_SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const DEFAULT_LONG_BREAK_TIME = 20 * 60; // 20 minutes in seconds
const DEFAULT_SESSIONS_BEFORE_LONG_BREAK = 4;
const AUTO_START_DELAY = 5; // 5 seconds delay before auto-start

const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: DEFAULT_WORK_TIME,
    shortBreakDuration: DEFAULT_SHORT_BREAK_TIME,
    longBreakDuration: DEFAULT_LONG_BREAK_TIME,
    sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
    autoStart: true
  });

  const [showSettings, setShowSettings] = useState(false);

  const [state, setState] = useState<PomodoroState>({
    timeLeft: settings.workDuration,
    isRunning: false,
    currentSession: 1,
    sessionType: 'work',
    autoStartCountdown: 0,
    isSessionComplete: false
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = useCallback((type: 'work' | 'shortBreak' | 'longBreak'): number => {
    switch (type) {
      case 'work':
        return settings.workDuration;
      case 'shortBreak':
        return settings.shortBreakDuration;
      case 'longBreak':
        return settings.longBreakDuration;
    }
  }, [settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration]);

  const getNextSessionType = useCallback((currentSession: number, currentType: 'work' | 'shortBreak' | 'longBreak'): 'work' | 'shortBreak' | 'longBreak' => {
    if (currentType === 'work') {
      return currentSession === settings.sessionsBeforeLongBreak ? 'longBreak' : 'shortBreak';
    }
    return 'work';
  }, [settings.sessionsBeforeLongBreak]);

  const nextSession = useCallback(() => {
    setState(prevState => {
      const nextType = getNextSessionType(prevState.currentSession, prevState.sessionType);
      const newSession = prevState.sessionType === 'work' && nextType === 'longBreak' 
        ? 1 
        : prevState.sessionType === 'work' 
          ? prevState.currentSession + 1 
          : prevState.currentSession;

      return {
        timeLeft: getSessionDuration(nextType),
        isRunning: false,
        currentSession: newSession,
        sessionType: nextType,
        autoStartCountdown: 0,
        isSessionComplete: false
      };
    });
  }, [getNextSessionType, getSessionDuration]);

  const toggleTimer = () => {
    setState(prevState => ({
      ...prevState,
      isRunning: !prevState.isRunning
    }));
  };

  const resetTimer = () => {
    setState({
      timeLeft: settings.workDuration,
      isRunning: false,
      currentSession: 1,
      sessionType: 'work',
      autoStartCountdown: 0,
      isSessionComplete: false
    });
  };

  const skipSession = () => {
    nextSession();
  };

  const handleSettingsUpdate = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    // Reset timer with new settings if not running
    if (!state.isRunning) {
      setState(prevState => ({
        ...prevState,
        timeLeft: newSettings.workDuration,
        sessionType: 'work',
        currentSession: 1,
        autoStartCountdown: 0,
        isSessionComplete: false
      }));
    }
  };

  // Update timer when settings change and timer is not running
  useEffect(() => {
    if (!state.isRunning && state.sessionType === 'work' && state.currentSession === 1) {
      setState(prevState => ({
        ...prevState,
        timeLeft: settings.workDuration
      }));
    }
  }, [settings.workDuration, state.isRunning, state.sessionType, state.currentSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          timeLeft: prevState.timeLeft - 1
        }));
      }, 1000);
    } else if (state.timeLeft === 0 && !state.isSessionComplete) {
      // Session completed
      setState(prevState => ({
        ...prevState,
        isRunning: false,
        isSessionComplete: true,
        autoStartCountdown: AUTO_START_DELAY
      }));
      
      // Play notification sound (browser notification)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${state.sessionType === 'work' ? 'Work' : 'Break'} session completed!`, {
          body: `Next session starts automatically in ${AUTO_START_DELAY} seconds`,
          icon: '/favicon.ico'
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.timeLeft, state.isSessionComplete, state.sessionType]);

  // Auto-start countdown effect
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;

    if (state.isSessionComplete && state.autoStartCountdown > 0 && settings.autoStart) {
      countdownInterval = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          autoStartCountdown: prevState.autoStartCountdown - 1
        }));
      }, 1000);
    } else if (state.isSessionComplete && state.autoStartCountdown === 0 && settings.autoStart) {
      // Auto-start next session
      nextSession();
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          isRunning: true
        }));
      }, 100);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [state.autoStartCountdown, state.isSessionComplete, settings.autoStart, nextSession]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getSessionLabel = (): string => {
    switch (state.sessionType) {
      case 'work':
        return `Work Session ${state.currentSession}`;
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const getProgressPercentage = (): number => {
    const totalTime = getSessionDuration(state.sessionType);
    return ((totalTime - state.timeLeft) / totalTime) * 100;
  };

  return (
    <div className={`pomodoro-timer ${state.sessionType}`}>
      <div className="timer-container">
        <div className="session-info">
          <h2>{getSessionLabel()}</h2>
          <div className="session-counter">
            {Array.from({ length: settings.sessionsBeforeLongBreak }, (_, i) => (
              <div 
                key={i} 
                className={`session-dot ${i < state.currentSession ? 'completed' : ''} ${i === state.currentSession - 1 && state.sessionType === 'work' ? 'current' : ''}`}
              />
            ))}
          </div>
        </div>
        
        <div className="timer-display">
          <div className="progress-ring">
            <svg className="progress-circle" width="300" height="300">
              <circle
                className="progress-background"
                cx="150"
                cy="150"
                r="140"
                strokeWidth="8"
                fill="none"
              />
              <circle
                className="progress-bar"
                cx="150"
                cy="150"
                r="140"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 140}`}
                strokeDashoffset={`${2 * Math.PI * 140 * (1 - getProgressPercentage() / 100)}`}
              />
            </svg>
            <div className="timer-text">
              <div className="time">{formatTime(state.timeLeft)}</div>
              <div className="status">{state.isRunning ? 'Running' : 'Paused'}</div>
            </div>
          </div>
        </div>

        <div className="controls">
          <button 
            className={`control-btn primary ${state.isRunning ? 'pause' : 'play'}`}
            onClick={toggleTimer}
          >
            {state.isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          
          <button 
            className="control-btn secondary"
            onClick={resetTimer}
          >
            🔄 Reset
          </button>
          
          <button 
            className="control-btn secondary"
            onClick={skipSession}
          >
            ⏭️ Skip
          </button>
          
          <button 
            className="control-btn secondary"
            onClick={() => setShowSettings(true)}
          >
            ⚙️ Settings
          </button>
        </div>

        {state.isSessionComplete && (
          <div className="session-complete">
            <h3>Session Complete! 🎉</h3>
            {settings.autoStart && state.autoStartCountdown > 0 ? (
              <div className="auto-start-info">
                <p>Next session starts automatically in:</p>
                <div className="countdown-timer">{state.autoStartCountdown}</div>
                <button 
                  className="control-btn secondary"
                  onClick={() => setState(prev => ({ ...prev, autoStartCountdown: 0, isSessionComplete: false }))}
                >
                  Cancel Auto-Start
                </button>
              </div>
            ) : settings.autoStart ? (
              <div>
                <p>Starting next session...</p>
              </div>
            ) : (
              <div>
                <p>Ready for the next session?</p>
                <button 
                  className="control-btn primary"
                  onClick={() => {
                    nextSession();
                    setState(prev => ({ ...prev, isRunning: true }));
                  }}
                >
                  Start {getNextSessionType(state.currentSession, state.sessionType) === 'work' ? 'Work' : 'Break'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {showSettings && (
        <Settings
          workDuration={settings.workDuration}
          shortBreakDuration={settings.shortBreakDuration}
          longBreakDuration={settings.longBreakDuration}
          sessionsBeforeLongBreak={settings.sessionsBeforeLongBreak}
          autoStart={settings.autoStart}
          onSave={handleSettingsUpdate}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default PomodoroTimer;
