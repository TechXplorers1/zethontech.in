import React from 'react';
import { documentTypes } from '../../helpers';

const Documents = ({ activeSubTab, handleSubTabChange, clientFiles = [], onImageView }) => {
  // Filter files based on the active sub-tab
  const filesForSubTab = clientFiles.filter(file => file.type === documentTypes[activeSubTab]);
  const otherFiles = clientFiles.filter(file => !Object.values(documentTypes).includes(file.type) || file.type === 'other');

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginBottom: "16px", textAlign: 'center' }}>
        My Documents
      </h3>
      {/* Sub-Tabs */}
      <div style={{ display: "flex", gap: "10px", justifyContent: 'center', flexWrap: 'wrap' }}>
        {Object.keys(documentTypes).map(tabName => (
          <button key={tabName} style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: activeSubTab === tabName ? "#007bff" : "#f0f0f0", color: activeSubTab === tabName ? "#fff" : "#333", cursor: "pointer" }} onClick={() => handleSubTabChange(tabName)}>
            {tabName} ({tabName === 'Others' ? otherFiles.length : clientFiles.filter(f => f.type === documentTypes[tabName]).length})
          </button>
        ))}
      </div>

      {/* Sub-Tab Content */}
      <div>
        {activeSubTab === "Resumes" && <Resumes files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "CoverLetters" && <CoverLetters files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "Interviews" && <Interviews files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "Offers" && <Offers files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "Portfolio" && <Portfolio files={filesForSubTab} onImageView={onImageView} />}
        {activeSubTab === "Others" && <Others files={otherFiles} onImageView={onImageView} />}
      </div>
    </div>
  );
};

const Resumes = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No resumes found.</p>}
    </div>
  );
};

const CoverLetters = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No cover letters found.</p>}
    </div>
  );
};

const Interviews = ({ files }) => { // onImageView is no longer needed here
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a
          key={file.id || file.name}
          href={file.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              padding: "20px", border: "1px solid #ccc", borderRadius: "8px",
              width: "250px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              backgroundColor: '#fff', cursor: 'pointer', transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={file.downloadUrl}
              alt={file.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
            />
            <p style={{ margin: 0, fontWeight: '500', wordBreak: 'break-word' }}>{file.name}</p>
          </div>
        </a>
      )) : <p>No interview screenshots found.</p>}
    </div>
  );
};

const Offers = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No offers found.</p>}
    </div>
  );
};


const Portfolio = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No offers found.</p>}
    </div>
  );
};


const Others = ({ files }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
      {files.length > 0 ? files.map(file => (
        <a key={file.id || file.name} href={file.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: "40px", border: "1px solid #ccc", borderRadius: "8px", width: "350px", textAlign: "center", boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff', cursor: 'pointer' }}>
            📄 {file.name}
          </div>
        </a>
      )) : <p>No other documents found.</p>}
    </div>
  );
};

// --- InterviewsScheduled Tab Content (New Component) ---

export default Documents;
