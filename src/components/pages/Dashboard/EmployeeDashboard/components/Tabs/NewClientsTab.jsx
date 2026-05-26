import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const defaultApplicationsSectionStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '32px',
};

const defaultSectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '24px',
};

const defaultSubLabelStyle = {
  fontSize: '1rem',
  color: '#64748b',
  margin: '4px 0 24px 0',
};

const defaultNewClientsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
  marginTop: '20px',
};

const defaultNewClientCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const defaultNewClientCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #f1f5f9',
};

const defaultInitialsCircleStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#e0effe',
  color: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: '600',
};

const defaultNewClientNameStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
  wordBreak: 'break-word',
  whiteSpace: 'normal'
};

const defaultNewClientDetailStyle = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '6px',
  fontSize: '0.9rem',
  color: '#475569',
  margin: 0,
  wordBreak: 'break-word',
  whiteSpace: 'normal'
};

const defaultClientDetailIconStyle = {
  color: '#94a3b8',
  marginRight: '8px',
};

const defaultNewClientCardActionsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '16px',
  justifyContent: 'flex-end',
};

const defaultAcceptButtonStyle = {
  background: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const NewClientsTab = (props) => {
  const {
    activeTab,
    newClients = [],
    newClientCardStyle = defaultNewClientCardStyle,
    newClientCardHeaderStyle = defaultNewClientCardHeaderStyle,
    initialsCircleStyle = defaultInitialsCircleStyle,
    newClientNameStyle = defaultNewClientNameStyle,
    newClientDetailStyle = defaultNewClientDetailStyle,
    clientDetailIconStyle = defaultClientDetailIconStyle,
    newClientCardActionsStyle = defaultNewClientCardActionsStyle,
    handleAcceptClient,
    applicationsSectionStyle = defaultApplicationsSectionStyle,
    sectionTitleStyle = defaultSectionTitleStyle,
    subLabelStyle = defaultSubLabelStyle,
    newClientsGridStyle = defaultNewClientsGridStyle,
    acceptButtonStyle = defaultAcceptButtonStyle,
  } = props;

  return (
    <>
      {activeTab === 'New Clients' && (
        <div style={applicationsSectionStyle}>
          <h2 style={sectionTitleStyle}>New Client Requests</h2>
          <p style={subLabelStyle}>Review and manage new client registrations.</p>
          {newClients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              No new client requests at this time.
            </div>
          ) : (
            <div style={newClientsGridStyle}>
              {newClients.map(client => (
                <div key={client.registrationKey} style={newClientCardStyle}>
                  <div style={newClientCardHeaderStyle}>
                    <div style={initialsCircleStyle}>{client.initials}</div>
                    <div style={{ flexGrow: 1 }}>
                      <p style={newClientNameStyle}>{client.name}</p>
                      <p style={newClientDetailStyle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                          <path d="M22 16.92v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3"></path>
                          <polyline points="16 16 12 20 8 16"></polyline>
                          <line x1="12" y1="20" x2="12" y2="10"></line>
                        </svg>
                        {client.mobile}
                      </p>
                      <p style={newClientDetailStyle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        {client.email}
                      </p>
                    </div>
                  </div>
                  <p style={newClientDetailStyle}><strong style={{whiteSpace: 'nowrap'}}>Applying For:</strong> <span>{client.jobsToApply}</span></p>
                  <p style={newClientDetailStyle}><strong style={{whiteSpace: 'nowrap'}}>Registered:</strong> <span>{client.registeredDate}</span></p>
                  <p style={newClientDetailStyle}><strong style={{whiteSpace: 'nowrap'}}>Country:</strong> <span>{client.country}</span></p>
                  <p style={newClientDetailStyle}><strong style={{whiteSpace: 'nowrap'}}>Visa Status:</strong> <span>{client.visaStatus}</span></p>
                  <div style={newClientCardActionsStyle}>
                    <button onClick={() => handleAcceptClient(client)} style={acceptButtonStyle}>Accept</button>
                    {/* <button onClick={() => handleDeclineClient(client.id)} style={declineButtonStyle}>Decline</button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NewClientsTab;
