{activeTab === 'Assignments' && (
          <section className="client-assignment-overview">
            <div className="client-assignment-header">
              <h2 className="client-assignment-title">Client Assignment Overview</h2>
              {/* Removed Assign New Client button */}
            </div>
            <div className="assignment-cards-grid">
              {/* Unassigned Card - now clickable to open modal */}
              <div className="assignment-card" onClick={() => setIsUnassignedClientsModalOpen(true)}>
                <div className="assignment-card-value">{totalUnassignedCount}</div>
                <div className="assignment-card-title">Clients Unassigned</div>
                <div className="assignment-card-description">View all unassigned clients</div>
              </div>

              {/* Total Clients Card (formerly Assigned) - now clickable to open new modal */}
              <div className="assignment-card assigned" onClick={openTotalClientsModal}>
                <div className="assignment-card-value">{totalClientsCount}</div>
                <div className="assignment-card-title">Total Assigned/Active Clients</div>
                <div className="assignment-card-description">View all assigned clients</div>
              </div>

              {/* NEW: Total Inactive Clients Card */}
              <div className="assignment-card inactive" onClick={() => setIsInactiveClientsModalOpen(true)}>
                <div className="assignment-card-value">{totalInactiveClientsCount}</div>
                <div className="assignment-card-title">Total Inactive Clients</div>
                <div className="assignment-card-description">View all inactive clients</div>
              </div>
            </div>
          </section>
        )}

        