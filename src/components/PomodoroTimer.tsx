import React, { useState, useEffect, useCallback } from 'react';
import './PomodoroTimer.css';

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  currentSession: number;
  sessionType: 'work' | 'shortBreak' | 'longBreak';
}

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_TIME = 20 * 60; // 20 minutes in seconds
const SESSIONS_BEFORE_LONG_BREAK = 4;

const PomodoroTimer: React.FC = () => {
  const [state, setState] = useState<PomodoroState>({
    timeLeft: WORK_TIME,
    isRunning: false,
    currentSession: 1,
    sessionType: 'work'
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = (type: 'work' | 'shortBreak' | 'longBreak'): number => {
    switch (type) {
      case 'work':
        return WORK_TIME;
      case 'shortBreak':
        return SHORT_BREAK_TIME;
      case 'longBreak':
        return LONG_BREAK_TIME;
    }
  };

  const getNextSessionType = (currentSession: number, currentType: 'work' | 'shortBreak' | 'longBreak'): 'work' | 'shortBreak' | 'longBreak' => {
    if (currentType === 'work') {
      return currentSession === SESSIONS_BEFORE_LONG_BREAK ? 'longBreak' : 'shortBreak';
    }
    return 'work';
  };

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
        sessionType: nextType
      };
    });
  }, []);

  const toggleTimer = () => {
    setState(prevState => ({
      ...prevState,
      isRunning: !prevState.isRunning
    }));
  };

  const resetTimer = () => {
    setState({
      timeLeft: WORK_TIME,
      isRunning: false,
      currentSession: 1,
      sessionType: 'work'
    });
  };

  const skipSession = () => {
    nextSession();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          timeLeft: prevState.timeLeft - 1
        }));
      }, 1000);
    } else if (state.timeLeft === 0) {
      // Session completed
      setState(prevState => ({
        ...prevState,
        isRunning: false
      }));
      
      // Play notification sound (browser notification)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${state.sessionType === 'work' ? 'Work' : 'Break'} session completed!`, {
          body: `Time for ${getNextSessionType(state.currentSession, state.sessionType) === 'work' ? 'work' : 'a break'}`,
          icon: '/favicon.ico'
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.timeLeft, state.sessionType, state.currentSession]);

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
            {Array.from({ length: SESSIONS_BEFORE_LONG_BREAK }, (_, i) => (
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
        </div>

        {state.timeLeft === 0 && (
          <div className="session-complete">
            <h3>Session Complete! 🎉</h3>
            <p>Ready for the next session?</p>
            <button 
              className="control-btn primary"
              onClick={nextSession}
            >
              Start {getNextSessionType(state.currentSession, state.sessionType) === 'work' ? 'Work' : 'Break'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
