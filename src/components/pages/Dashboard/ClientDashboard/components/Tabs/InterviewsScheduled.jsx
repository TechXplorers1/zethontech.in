import React from 'react';

const InterviewsScheduled = ({ interviews, onAttachmentClick, showAttachmentModal, currentAttachments, closeAttachmentModal }) => {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        marginBottom: '25px',
        textAlign: 'center',
        color: '#1e293b',
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        Scheduled Interviews
      </h3>
      {interviews.length > 0 ? (
        <div className="modal-table-container">
          <table className="modal-table">
            <thead>
              <tr>
                <th className="modal-table-header">Date</th>
                <th className="modal-table-header">Time</th>
                {/* <th className="modal-table-header">Job ID</th> */}
                <th className="modal-table-header">Company</th>
                <th className="modal-table-header">Job Type</th>
                <th className="modal-table-header">Recruiter Mail ID</th>
                <th className="modal-table-header">Round</th>
                <th className="modal-table-header">Attachment</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview.id} className="modal-table-row">
                  <td className="modal-table-cell">
                    <div style={{ fontWeight: '500' }}>{interview.appliedDate}</div>
                  </td>
                  <td className="modal-table-cell">{interview.interviewTime}</td>
                  {/* <td className="modal-table-cell">{interview.jobId}</td> */}
                  <td style={{ fontWeight: '600' }} className="modal-table-cell">{interview.company}</td>
                  <td style={{ fontWeight: '600' }} className="modal-table-cell">{interview.jobType}</td>
                  <td className="modal-table-cell">{interview.recruiterMail}</td>
                  <td className="modal-table-cell">
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      backgroundColor:
                        interview.round === 'Round 1' ? '#EFF6FF' :
                          interview.round === 'Round 2' ? '#ECFDF5' :
                            interview.round === 'Round 3' ? '#FEF3C7' : '#F3E8FF',
                      color:
                        interview.round === 'Round 1' ? '#1D4ED8' :
                          interview.round === 'Round 2' ? '#047857' :
                            interview.round === 'Round 3' ? '#92400E' : '#6B21A8',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {interview.round}
                    </div>
                  </td>
                  <td className="modal-table-cell">
                    {interview.attachments && interview.attachments.length > 0 ? (
                      <button
                        onClick={() => onAttachmentClick(interview.attachments)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: '#3b82f6',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                          <path d="M16 21v-6a2 2 0 0 1 2-2h2l-5 5-5-5h2a2 2 0 0 1 2 2v6z"></path>
                        </svg>
                        ({interview.attachments.length})
                      </button>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>No interviews scheduled.</p>
      )}

      {showAttachmentModal && (
        <AttachmentModal
          attachments={currentAttachments}
          onClose={closeAttachmentModal}
        />
      )}
    </div>
  );
};


// --- WorksheetView Component (New) ---
// This component will house the Applications and Documents tabs

export default InterviewsScheduled;
