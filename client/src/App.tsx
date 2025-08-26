import React from 'react';
import './App.css';
import AllocationForm from './components/AllocationForm';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Sukut Construction</h1>
        <p>Weekly Time Allocation</p>
      </header>
      <main>
        <AllocationForm />
      </main>
    </div>
  );
}

export default App;
