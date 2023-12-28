// import logo from './logo.svg';
import './App.css';
import ChatSummary from './components/ChatSummary';
import chatData from './message.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2>微信聊天年度总结</h2>
      </header>

      <ChatSummary chatData={chatData} />
    </div>
  );
}

export default App;
