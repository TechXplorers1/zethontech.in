import React from 'react';

const ClientsTab = ({
  totalUnassignedCount,
  setIsUnassignedClientsModalOpen,
  totalClientsCount,
  openTotalClientsModal,
  totalInactiveClientsCount,
  setIsInactiveClientsModalOpen
}) => {
  return (
    <section className="client-assignment-overview">
      <div className="client-assignment-header">
        <h2 className="client-assignment-title">Client Assignment Overview</h2>
      </div>
      <div className="assignment-cards-grid">
        <div className="assignment-card" onClick={() => setIsUnassignedClientsModalOpen(true)}>
          <div className="assignment-card-value">{totalUnassignedCount}</div>
          <div className="assignment-card-title">Clients Unassigned</div>
          <div className="assignment-card-description">View all unassigned clients</div>
        </div>

        <div className="assignment-card assigned" onClick={openTotalClientsModal}>
          <div className="assignment-card-value">{totalClientsCount}</div>
          <div className="assignment-card-title">Total Assigned/Active Clients</div>
          <div className="assignment-card-description">View all assigned clients</div>
        </div>

        <div className="assignment-card inactive" onClick={() => setIsInactiveClientsModalOpen(true)}>
          <div className="assignment-card-value">{totalInactiveClientsCount}</div>
          <div className="assignment-card-title">Total Inactive Clients</div>
          <div className="assignment-card-description">View all inactive clients</div>
        </div>
      </div>
    </section>
  );
};

export default ClientsTab;
