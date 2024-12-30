import React from 'react';
import Header from './components/Header';
import EditorComponent from './components/TEditor';
import './App.css';

function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <EditorComponent />
      </main>
    </div>
  );
}

export default App;
