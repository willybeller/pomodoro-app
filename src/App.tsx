import './App.css';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🍅 Pomodoro Timer</h1>
        <p>Boost your productivity with the Pomodoro Technique</p>
      </header>
      <main>
        <PomodoroTimer />
      </main>
    </div>
  );
}

export default App;
