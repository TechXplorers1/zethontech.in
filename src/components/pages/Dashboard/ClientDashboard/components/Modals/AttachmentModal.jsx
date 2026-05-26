import React from 'react';

const AttachmentModal = ({ attachments, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{ maxWidth: '700px', padding: '40px', background: '#ffffff', color: '#1e293b' }}>
        <button onClick={onClose} className="modal-close-button" style={{ color: '#64748B' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h3 style={{ marginBottom: '30px', textAlign: 'center', color: '#1e293b', fontSize: '1.8rem', fontWeight: '700' }}>
          Interview Attachments
        </h3>
        {attachments.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No attachments available for this interview.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {attachments.map((attachment, index) => (
              // MODIFICATION: Wrap image in an anchor (<a>) tag to make it clickable
              <a
                key={attachment.downloadUrl || index}
                href={attachment.downloadUrl} // <-- Set link destination
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '200px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer', // <-- Add pointer cursor
                  transition: 'transform 0.2s ease'
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    // FIX: Use the 'downloadUrl' property from the attachment object
                    src={attachment.downloadUrl}
                    // MODIFICATION: Use the attachment name for better accessibility
                    alt={attachment.name || `Attachment ${index + 1}`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x150/e2e8f0/64748B?text=Image+Error'; }}
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentModal;
