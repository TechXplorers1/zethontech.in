import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const ClientSelectModal = (props) => {
  const {
    activeTab,
    activeClients,
    inactiveClients,
    isClientSelectModalOpen,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle = { fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' },
    clientSearchTermInModal = '',
    setClientSearchTermInModal = () => {},
    handleSelectClientFromModal = () => {},
    handleCloseClientSelectModal = () => {}
  } = props;

  return (
    <>
        <Modal show={isClientSelectModalOpen} onHide={handleCloseClientSelectModal} size="md" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Select a Client</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ ...modalBodyStyle, padding: '15px 25px' }}>
            <div className="client-select-search-container">
              <input
                type="text"
                placeholder="Search clients by name..."
                className="client-select-search-input"
                value={clientSearchTermInModal}
                onChange={(e) => setClientSearchTermInModal(e.target.value)}
                autoFocus
              />
            </div>
            <div className="client-select-list">
              {(activeTab === 'Active Clients' ? activeClients : inactiveClients)
                .filter(client =>
                  `${client.firstName} ${client.lastName}`.toLowerCase().includes(clientSearchTermInModal.toLowerCase())
                )
                .map(client => (
                  <div key={client.registrationKey} className="client-select-item" onClick={() => handleSelectClientFromModal(client)}>
                    <div className="client-select-avatar">{client.initials}</div>
                    <div className="client-select-info">
                      <div className="client-select-name">{`${client.firstName} ${client.lastName}`}</div>
                      <div className="client-select-role">{client.role}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </Modal.Body>
        </Modal>
    </>
  );
};

export default ClientSelectModal;
