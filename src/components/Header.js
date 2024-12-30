import React, { useState } from 'react';
import './Header.css';

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header">
      <h1>Draft.js Editor</h1>
      <div className="header-buttons">
        <button className="header-button doc-button" onClick={openModal}>
          Documentation
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Draft.js Editor - How It Works</h2>
            <p className="modal-description">
              This editor allows you to apply various text styles using markdown-like syntax. Here's how you can use it:
            </p>
            <ul className="modal-list">
              <li><strong>#</strong> followed by space to make the text a <strong>heading</strong>.</li>
              <li><strong>*</strong> followed by space to apply <strong>bold styling</strong>.</li>
              <li><strong>**</strong> followed by space to apply <strong>red text styling</strong>.</li>
              <li><strong>***</strong> followed by space to <strong>underline</strong> the text.</li>
            </ul>
            <p className="modal-note">Press the "Save" button to save your content locally.</p>
            <button className="modal-close" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;