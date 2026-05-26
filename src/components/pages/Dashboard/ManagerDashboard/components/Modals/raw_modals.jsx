{/* Unassigned Clients Modal */}
      {isUnassignedClientsModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Unassigned Clients Management</h3>
              <button className="modal-close-button" onClick={closeUnassignedClientsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-priority-overview">
              <div className="priority-card">
                <div className="priority-card-value">{totalUnassignedCount}</div>
                <div className="priority-card-title">Total Unassigned</div>
              </div>
              {/* <div className="priority-card high">
                <div className="priority-card-value">{highPriorityCount}</div>
                <div className="priority-card-title">High Priority</div>
              </div>
              <div className="priority-card medium">
                <div className="priority-card-value">{mediumPriorityCount}</div>
                <div className="priority-card-title">Medium Priority</div>
              </div>
              <div className="priority-card low">
                <div className="priority-card-value">{lowPriorityCount}</div>
                <div className="priority-card-title">Low Priority</div>
              </div> */}
            </div>

            <div className="modal-actions-top">
              <div className="search-input-wrapper">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search clients by name, position..."
                  value={unassignedSearchQuery}
                  onChange={handleUnassignedSearchChange}
                />
              </div>
              {/* <div className="filter-dropdown">
                <select value={filterPriority} onChange={handleFilterPriorityChange}>
                  <option value="all">Filter by priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <i className="fas fa-chevron-down"></i>
              </div> */}
              {/* <button className="modal-quick-assign-button" onClick={handleQuickAssign}>
                <i className="fas fa-bolt"></i> Quick Assign
              </button>
              <button className="modal-export-button">
                <i className="fas fa-download"></i> Export List
              </button> */}
            </div>

            <h4 className="modal-title" style={{ marginBottom: '10px' }}>Available Clients</h4>
            <div className="modal-available-clients-list">
              {/* Render filtered clients */}
              {filteredClients.map((client) => {
                // This logic safely handles both data structures
                const clientName = client.name || `${client.firstName || ''} ${client.lastName || ''}`.trim();

                // THE FIX: Use .skills OR .technologySkills, and handle strings if necessary
                let clientSkills = client.skills || client.technologySkills || [];
                if (typeof clientSkills === 'string') {
                  clientSkills = clientSkills.split(',').map(s => s.trim());
                }

                const clientExperience = client.experience || `Experience not specified`;
                const clientEmail = client.email || client.personalMail;
                const clientSalary = client.salary || `$${client.expectedSalary || 'N/A'}`;

                return (
                  <div key={client.registrationKey} className="modal-client-card">
                    <div className="modal-client-card-header">
                      <span className="modal-client-name">{clientName}</span>
                      {client.priority && (
                        <span className={`modal-client-priority-badge ${client.priority}`}>{client.priority} priority</span>
                      )}
                    </div>
                    <div className="modal-client-skills">
                      {/* This now safely maps over the clientSkills array, which is guaranteed to exist */}
                      {clientSkills.map((skill, index) => (
                        <span key={index} className="modal-client-skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="modal-client-details">
                      {simplifiedServices.includes(client.service) ? (
                        // Simplified View for the 5 main services
                        <>
                          <span><i className="fas fa-concierge-bell"></i><strong>Service:</strong> {client.service || 'N/A'}</span>
                          <span><i className="fas fa-envelope"></i> {client.email || 'N/A'}</span>
                          <span><i className="fas fa-calendar-alt"></i><strong>Registered:</strong> {client.registeredDate || 'N/A'}</span>
                          <span><i className="fas fa-user-tag"></i><strong>Type:</strong> {client.userType || 'N/A'}</span>
                        </>
                      ) : (
                        // Detailed View for "Job Supporting & Consulting"
                        <>
                          <span><i className="fas fa-concierge-bell"></i><strong>Service:</strong> {client.service || 'N/A'}</span>
                          <span><i className="fas fa-envelope"></i> {client.email || 'N/A'}</span>
                          <span><i className="fas fa-calendar-alt"></i><strong>Registered:</strong> {client.registeredDate || 'N/A'}</span>
                          <span><i className="fas fa-user-tie"></i><strong>Designation:</strong> {client.currentDesignation || 'N/A'}</span>
                          <span><i className="fas fa-money-bill-wave"></i><strong>Expected Salary:</strong> {client.expectedSalary ? `$${client.expectedSalary}` : 'N/A'}</span>
                        </>
                      )}
                    </div>

                    <div className="modal-client-actions">
                      <button className="modal-assign-button" onClick={() => openAssignClientModal(client)}>
                        <i className="fas fa-user-plus"></i> Assign Employee
                      </button>
                      <button className="modal-view-profile-button" onClick={() => openEditClientModal(client)}>
                        <i className="fas fa-eye"></i> View Profile
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredClients.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>No clients match the selected filter or search query.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Client to Employee Modal (for NEW assignments) */}
      {/* Assign Client to Employee Modal (for NEW assignments) */}
      {isAssignClientModalOpen && selectedClientToAssign && (
        <div className="modal-overlay open">
          <div className="assign-modal-content">
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">
                Assign Client: {selectedClientToAssign.name || `${selectedClientToAssign.firstName} ${selectedClientToAssign.lastName}`}
              </h3>
              <button className="assign-modal-close-button" onClick={closeAssignClientModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* MODIFIED: Replaced the <select> with a clickable <div> */}
            <div className="form-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ width: '200px', fontWeight: '500' }}>Select Employee :</label>
              <div style={{ flex: 1 }}>
                {/* FIX 1: Added inline style to ensure text is aligned to the left */}
                <div
                  className="pseudo-input"
                  onClick={() => setIsEmployeeSelectModalOpen(true)}
                  style={{ textAlign: 'left' }}
                >
                  {selectedEmployeeDetails
                    ? selectedEmployeeDetails.fullName
                    : "Click to choose an employee..."
                  }
                </div>
              </div>
            </div>

            {/* The confirmation box still works perfectly! */}
            {selectedEmployeeDetails && (
              <div className="selected-employee-details">
                <h4>Selected Employee Details</h4>
                <p><strong>Name:</strong> {selectedEmployeeDetails.fullName}</p>
                <p><strong>Role:</strong> {selectedEmployeeDetails.role || (selectedEmployeeDetails.roles && selectedEmployeeDetails.roles.join(', '))}</p>
                {/* This line is the key change to show the correct, updated count */}
                <p><strong>Current Workload:</strong> {selectedEmployeeDetails.assignedClients} assigned clients</p>
              </div>
            )}

            {/* --- The rest of the form remains the same --- */}
            <div className="form-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ width: '200px', fontWeight: '500' }}>Priority Level :</label>
              <div style={{ position: 'relative', flex: 1 }}>
                <select
                  className="pseudo-input"
                  id="priorityLevel"
                  value={assignmentPriority}
                  onChange={(e) => setAssignmentPriority(e.target.value)}
                  style={{ paddingRight: '30px' }} // Add space for the icon
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <i
                  className="fas fa-chevron-down"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--icon-color)'
                  }}
                ></i>
              </div>
            </div>
            <div className="form-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ width: '200px', fontWeight: '500' }}>Assignment Notes :</label>
              <div style={{ flex: 1 }}>
                <textarea className="pseudo-input" id="assignmentNotes" placeholder="Any specific instructions or requirements..." value={assignmentNotes} onChange={(e) => setAssignmentNotes(e.target.value)}></textarea>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="assign-form-actions">
                <button className="assign-form-button cancel" onClick={closeAssignClientModal}>Cancel</button>
                <button className="assign-form-button assign" onClick={handleAssignmentSubmit}>Confirm Assignment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Modal Popup for Selecting an Employee */}
      {isEmployeeSelectModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Select an Employee</h3>
              <button className="modal-close-button" onClick={() => setIsEmployeeSelectModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="employee-select-list">
              {employeesForAssignment.map(employee => {
                const employeeWithCount = displayEmployees.find(e => e.firebaseKey === employee.firebaseKey);
                return (
                  <div
                    key={employee.firebaseKey}
                    className="employee-select-item"
                    onClick={() => {
                      setSelectedEmployee(employee.firebaseKey);
                      setIsEmployeeSelectModalOpen(false);
                    }}
                  >
                    <div className="employee-select-info">
                      <strong>{`${employee.firstName} ${employee.lastName}`}</strong>
                      <span>{employee.role || (employee.roles && employee.roles.join(', '))}</span>
                    </div>
                    <div className="clients-count-badge">
                      {employeeWithCount?.assignedClients || 0} clients
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Total Clients Modal */}
      {isTotalClientsModalOpen && (
        <div className="modal-overlay open">
          <div className="total-clients-modal-content">
            <div className="total-clients-modal-header">
              <div>
                <h3 className="total-clients-modal-title">
                  <i className="fas fa-users"></i> Total Assigned Clients
                </h3>
                <p className="total-clients-modal-subtitle">
                  Overview of all clients currently assigned to employees ({assignedClients.length} total)
                </p>
              </div>
              <button className="modal-close-button" onClick={closeTotalClientsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="table-responsive">
              <table className="total-clients-table">
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th>POSITION</th>
                    <th>SALARY</th>
                    <th>ASSIGNED TO</th>
                    <th>APPLICATION COUNT</th>
                    <th>PRIORITY</th>
                    {/* REMOVED: <th>STATUS</th> */}
                    <th>ASSIGNED DATE</th>
                    <th>DETAILS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedClients.map((client) => {
                    // FIX: Find the assigned employee's full name using their firebaseKey
                    const assignedEmployee = allEmployees.find(emp => emp.firebaseKey === client.assignedTo);
                    const assignedEmployeeName = assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : 'N/A';
                    const applicationCount = (client.jobApplications || []).length; // Get the count

                    const clientStatus = (client.assignmentStatus || 'active').charAt(0).toUpperCase() + (client.assignmentStatus || 'active').slice(1);
                    const statusColor = client.assignmentStatus === 'active' ? '#10b981' : '#ef4444';
                    const statusBg = client.assignmentStatus === 'active' ? '#dcfce7' : '#fee2e2';

                    return (
                      <tr key={client.registrationKey}>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {getInitials(client.name)}
                            </div>
                            <div className="client-info">
                              <div className="main-text">{client.name}</div>
                              <div className="sub-text">{client.location}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="position-info">
                            <div className="main-text">{client.jobsToApply}</div>
                            <div className="sub-text">{client.salary}</div>
                          </div>
                        </td>
                        <td>{client.currentSalary}</td>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {getInitials(assignedEmployeeName)}
                            </div>
                            {assignedEmployeeName}
                          </div>
                        </td>
                        <td> {/* NEW: Application Count Cell */}
                          <div style={{ textAlign: 'center' }}>
                            {applicationCount}
                          </div>
                        </td>
                        <td>
                          <span className={`modal-client-priority-badge ${client.priority}`}>
                            {(client.priority || '').charAt(0).toUpperCase() + (client.priority || '').slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="employee-cell">
                            <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                            {formatDateToDDMMYYYY(client.assignedDate)}
                          </div>
                        </td>
                        <td>
                          <button className="modal-view-profile-button" onClick={() => openEditClientModal(client)}>
                            <i className="fas fa-eye"></i> View Profile
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleOpenStatusConfirmModal(client)}
                            className="modal-assign-button"
                            style={{
                              backgroundColor: client.assignmentStatus === 'active' ? '#10b981' : '#ef4444', // Red for Inactive, Green for Active
                              padding: '6px 12px',
                              fontSize: '12px',
                              minWidth: 'unset',
                              margin: '0'
                            }}
                          >
                            {client.assignmentStatus === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {assignedClients.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-color)' }}>
                        No assigned clients to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Total Inactive Clients Modal */}
      {isInactiveClientsModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h3 className="modal-title">Total Inactive Clients</h3>
              <p className="modal-subtitle">Overview of clients currently marked as inactive ({inactiveAssignedClients.length} total)</p>
              <button className="modal-close-btn" onClick={() => setIsInactiveClientsModalOpen(false)}>&times;</button>
            </div>

            <div className="total-clients-table-container">
              <table className="total-clients-table">
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th>POSITION</th>
                    <th>SALARY</th>
                    <th>ASSIGNED TO</th>
                    <th>APPLICATION COUNT</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th>ASSIGNED DATE</th>
                    <th>ACTIONS</th>
                    <th>DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {/* FIX: Use inactiveAssignedClients as the data source */}
                  {inactiveAssignedClients.map((client) => {
                    const assignedEmployee = allEmployees.find(emp => emp.firebaseKey === client.assignedTo);
                    const assignedEmployeeName = assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : 'N/A';
                    const applicationCount = client.jobApplications ? client.jobApplications.length : 0;

                    const clientStatus = (client.assignmentStatus || 'active').charAt(0).toUpperCase() + (client.assignmentStatus || 'active').slice(1);
                    const statusColor = client.assignmentStatus === 'active' ? '#10b981' : '#ef4444';
                    const statusBg = client.assignmentStatus === 'active' ? '#dcfce7' : '#fee2e2';

                    return (
                      <tr key={client.registrationKey}>
                        <td>{client.name}</td>
                        <td>{client.jobsToApply || client.service}</td>
                        <td>{client.expectedSalary || 'N/A'}</td>
                        <td>
                          <div className="employee-info">
                            <div className="employee-avatar">{assignedEmployeeName.split(' ').map(n => n.charAt(0)).join('')}</div>
                            <span>{assignedEmployeeName}</span>
                          </div>
                        </td>
                        <td>{applicationCount}</td>
                        <td><span className={`priority-tag priority-${client.priority}`}>{client.priority}</span></td>

                        {/* STATUS COLUMN */}
                        <td>
                          <span style={{ backgroundColor: statusBg, color: statusColor, padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                            {clientStatus}
                          </span>
                        </td>

                        <td>{client.assignedDate}</td>

                        {/* ACTIONS COLUMN (Status Toggle) */}
                        <td>
                          <button
                            onClick={() => handleOpenStatusConfirmModal(client)}
                            className="modal-assign-button"
                            style={{
                              // If inactive, button prompts to go ACTIVE (color: Green)
                              backgroundColor: '#10b981',
                              padding: '6px 12px',
                              fontSize: '12px',
                              minWidth: 'unset',
                              margin: '0'
                            }}
                          >
                            Active
                          </button>
                        </td>

                        {/* DETAILS COLUMN */}
                        <td>
                          <button className="modal-view-profile-button" onClick={() => openEditClientModal(client)}>
                            <i className="fas fa-eye"></i> View Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel-button" onClick={() => setIsInactiveClientsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Employee Clients Detail Modal */}
      {isEmployeeClientsModalOpen && selectedEmployeeForClients && (
        <div className="modal-overlay open">
          <div className="employee-clients-modal-content">
            <div className="employee-clients-modal-header">
              <h3 className="employee-clients-modal-title">
                Clients Assigned to {selectedEmployeeForClients.fullName || 'Employee'}
              </h3>
              <button className="modal-close-button" onClick={closeEmployeeClientsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="employee-info-section" style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
              <h4>Employee Information</h4>
              <p><strong>Name:</strong> {selectedEmployeeForClients.fullName || 'N/A'}</p>
              <p><strong>Role:</strong> {selectedEmployeeForClients.role || (selectedEmployeeForClients.role && selectedEmployeeForClients.role.join(', ')) || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedEmployeeForClients.workEmail || selectedEmployeeForClients.email || 'N/A'}</p>
              <p><strong>Total Assigned Clients:</strong> {selectedEmployeeForClients.assignedClients ? selectedEmployeeForClients.assignedClients.length : 0}</p>
            </div>

            <div className="employee-clients-list">
              {selectedEmployeeForClients.assignedClients && selectedEmployeeForClients.assignedClients.length > 0 ? (
                selectedEmployeeForClients.assignedClients.map(client => {
                  const clientName = client.name || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Unnamed Client';
                  const priority = client.priority || 'medium';
                  const position = client.position || client.jobsToApply || 'Position not specified';
                  const company = client.company ? ` at ${client.company}` : '';
                  const salary = client.salary || client.expectedSalary || 'Salary not specified';
                  const location = client.location || 'Location not specified';
                  const assignedDate = client.assignedDate ? formatDateToDDMMYYYY(client.assignedDate) : 'Date not specified';
                  const status = client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Not Specified';

                  return (
                    <div key={client.registrationKey || client.id || Math.random()} className="employee-client-card">
                      <div className="employee-client-card-header">
                        <span className="employee-client-name">{clientName}</span>
                        <span className={`modal-client-priority-badge ${priority}`}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                        </span>
                      </div>

                      <div className="employee-client-position">
                        {position}{company}
                      </div>

                      <div className="employee-client-details-row">
                        <span className="employee-client-details-item">
                          <i className="fas fa-money-bill-wave"></i> {salary}
                        </span>
                        <span className="employee-client-details-item">
                          <i className="fas fa-map-marker-alt"></i> {location}
                        </span>
                        <span className="employee-client-details-item">
                          <i className="fas fa-calendar-alt"></i> Assigned: {assignedDate}
                        </span>
                        <span className="employee-client-details-item">
                          <i className="fas fa-info-circle"></i> Status: {status}
                        </span>
                      </div>

                      {client.technologySkills && (
                        <div className="employee-client-skills">
                          <strong>Skills:</strong>
                          <div className="modal-client-skills">
                            {Array.isArray(client.technologySkills) ? (
                              client.technologySkills.map((skill, index) => (
                                <span key={index} className="modal-client-skill-tag">{skill}</span>
                              ))
                            ) : (
                              <span className="modal-client-skill-tag">{client.technologySkills}</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="modal-client-actions" style={{ justifyContent: 'flex-start', marginTop: '15px' }}>
                        <button className="modal-assign-button" onClick={() => openReassignClientModal(client)}>
                          <i className="fas fa-exchange-alt"></i> Reassign
                        </button>
                        <button className="modal-view-profile-button" onClick={() => openEditClientModal(client)}>
                          <i className="fas fa-eye"></i> View Full Profile
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-color)' }}>
                  <i className="fas fa-users" style={{ fontSize: '48px', opacity: 0.3, marginBottom: '15px' }}></i>
                  <h4>No Clients Assigned</h4>
                  <p>{selectedEmployeeForClients.fullName || 'This employee'} doesn't have any clients assigned yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW: Reassign Client Modal (reusing assign-modal-content) */}
      {isReassignClientModalOpen && clientToReassign && (
        <div className="modal-overlay open">
          <div className="assign-modal-content">
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">Reassign Client: {clientToReassign.clientName}</h3>
              <button className="assign-modal-close-button" onClick={closeReassignClientModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--subtitle-color)', margin: '0' }}>
              Select a new employee for {clientToReassign.clientName}.
            </p>

            <div className="assign-form-group">
              <label htmlFor="currentEmployee">Current Employee</label>
              <input
                type="text"
                id="currentEmployee"
                value={clientToReassign.assignedTo}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>

            <div className="assign-form-group">
              <label htmlFor="selectNewEmployee">Select New Employee</label>
              <select
                id="selectNewEmployee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Choose new employee</option>
                {employeesForAssignment
                  .filter(emp => `${emp.firstName} ${emp.lastName}` !== clientToReassign.assignedTo) // Exclude current employee
                  .map((employee) => (
                    <option key={employee.firebaseKey} value={employee.firebaseKey}>
                      {`${employee.firstName} ${employee.lastName}`} - {employee.role || (employee.roles && employee.roles.join(', '))}
                    </option>
                  ))}
              </select>
            </div>

            <div className="assign-form-group">
              <label htmlFor="reassignPriorityLevel">Priority Level</label>
              <select
                id="reassignPriorityLevel"
                value={assignmentPriority}
                onChange={(e) => setAssignmentPriority(e.target.value)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="assign-form-group">
              <label htmlFor="reassignAssignmentNotes">Reassignment Notes</label>
              <textarea
                id="reassignAssignmentNotes"
                placeholder="Any specific instructions for reassignment..."
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="assign-form-actions">
              <button className="assign-form-button cancel" onClick={closeReassignClientModal}>
                Cancel
              </button>
              <button className="assign-form-button assign" onClick={handleAssignmentSubmit}>
                Reassign Client
              </button>
            </div>
          </div>
        </div>
      )}


      {/* NEW: Client Edit Modal (repurposing the preview modal for editing) */}
      {isEditClientModalOpen && clientToEdit && (
        <div className="modal-overlay open">
          <div className="assign-modal-content"> {/* Reusing assign-modal-content for its wider layout */}
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">
                {isEditingClient ? 'Edit Client Details' : 'View Client Details'}: {clientToEdit.name || clientToEdit.firstName} {clientToEdit.lastName}
              </h3>
              <button className="assign-modal-close-button" onClick={closeEditClientModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Comprehensive Client Details Grid - now with input fields */}
            {simplifiedServices.includes(clientToEdit.service) ? (
              // --- RENDER SIMPLIFIED VIEW ---
              <div className="client-preview-grid-container" style={{ gridTemplateColumns: '1fr' }}>
                <div className="client-preview-section">
                  <h4 className="client-preview-section-title">Service Request Details</h4>
                  <div className="assign-form-group">
                    <label>First Name *</label>
                    <input type="text" name="firstName" value={clientToEdit.firstName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} required />
                  </div>
                  <div className="assign-form-group">
                    <label>Last Name *</label>
                    <input type="text" name="lastName" value={clientToEdit.lastName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} required />
                  </div>
                  <div className="assign-form-group">
                    <label>Mobile *</label>
                    <input type="tel" name="mobile" value={clientToEdit.mobile || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} required />
                  </div>
                  <div className="assign-form-group">
                    <label>Email ID *</label>
                    <input type="email" name="email" value={clientToEdit.email || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} required />
                  </div>
                  <div className="assign-form-group">
                    <label>Service *</label>
                    <input type="text" name="service" value={clientToEdit.service || ''} readOnly style={{ cursor: 'not-allowed' }} />
                  </div>
                  {clientToEdit.subServices && (
                    <div className="assign-form-group">
                      <label>Selected Sub-Services</label>
                      <textarea name="subServices" value={Array.isArray(clientToEdit.subServices) ? clientToEdit.subServices.join(', ') : ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                    </div>
                  )}
                  <div className="assign-form-group">
                    <label>User Type</label>
                    <input type="text" name="userType" value={clientToEdit.userType || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="client-preview-grid-container">
                  {/* Personal Information */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Personal Information</h4>
                    <div className="assign-form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input type="text" id="firstName" name="firstName" value={clientToEdit.firstName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="middleName">Middle Name</label>
                      <input type="text" id="middleName" name="middleName" value={clientToEdit.middleName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input type="text" id="lastName" name="lastName" value={clientToEdit.lastName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="dob">Date of Birth</label>
                      <input type="date" id="dob" name="dob" value={clientToEdit.dob || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="gender">Gender</label>
                      <input type="text" id="gender" name="gender" value={clientToEdit.gender || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="ethnicity">Ethnicity</label>
                      <input type="text" id="ethnicity" name="ethnicity" value={clientToEdit.ethnicity || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Contact Information</h4>
                    <div className="assign-form-group">
                      <label htmlFor="address">Address</label>
                      <textarea id="address" name="address" value={clientToEdit.address || ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="county">County</label>
                      <input type="text" id="county" name="county" value={clientToEdit.county || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="zipCode">Zip Code</label>
                      <input type="text" id="zipCode" name="zipCode" value={clientToEdit.zipCode || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="mobile">Mobile</label>
                      <input type="tel" id="mobile" name="mobile" value={clientToEdit.mobile || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" name="email" value={clientToEdit.email || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                  </div>

                  {/* Job Preferences & Status */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Job Preferences & Status</h4>
                    <div className="assign-form-group">
                      <label htmlFor="securityClearance">Security Clearance</label>
                      <select id="securityClearance" name="securityClearance" value={clientToEdit.securityClearance || 'No'} onChange={handleEditClientChange} disabled={!isEditingClient}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    {clientToEdit.securityClearance === 'Yes' && (
                      <div className="assign-form-group">
                        <label htmlFor="clearanceLevel">Clearance Level</label>
                        <input type="text" id="clearanceLevel" name="clearanceLevel" value={clientToEdit.clearanceLevel || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                      </div>
                    )}
                    <div className="assign-form-group">
                      <label htmlFor="willingToRelocate">Willing to Relocate</label>
                      <select id="willingToRelocate" name="willingToRelocate" value={clientToEdit.willingToRelocate || 'No'} onChange={handleEditClientChange} disabled={!isEditingClient}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="workPreference">Work Preference</label>
                      <input type="text" id="workPreference" name="workPreference" value={clientToEdit.workPreference || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="restrictedCompanies">Restricted Companies</label>
                      <input type="text" id="restrictedCompanies" name="restrictedCompanies" value={clientToEdit.restrictedCompanies || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="jobsToApply">Years of Experience</label>
                      <input type="text" id="yearsOfExperience" name="yearsOfExperience" value={clientToEdit.yearsOfExperience || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="jobsToApply">Jobs to Apply</label>
                      <input type="text" id="jobsToApply" name="jobsToApply" value={clientToEdit.jobsToApply || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>

                    <div className="assign-form-group">
                      <label htmlFor="currentSalary">Current Salary</label>
                      <input type="text" id="currentSalary" name="currentSalary" value={clientToEdit.currentSalary || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="expectedSalary">Expected Salary</label>
                      <input type="text" id="expectedSalary" name="expectedSalary" value={clientToEdit.expectedSalary || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="visaStatus">Visa Status</label>
                      <input type="text" id="visaStatus" name="visaStatus" value={clientToEdit.visaStatus || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    {clientToEdit.visaStatus === 'Other' && (
                      <div className="assign-form-group">
                        <label htmlFor="otherVisaStatus">Other Visa Status</label>
                        <input type="text" id="otherVisaStatus" name="otherVisaStatus" value={clientToEdit.otherVisaStatus || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                      </div>
                    )}
                    <div className="assign-form-group">
                      <label htmlFor="priority">Priority</label>
                      <select id="priority" name="priority" value={clientToEdit.priority || 'medium'} onChange={handleEditClientChange} disabled={!isEditingClient}>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="status">Status</label>
                      <input type="text" id="status" name="status" value={clientToEdit.status || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    {/* NEW: Platform, Job ID, Applied Date for editing */}
                    <div className="assign-form-group">
                      <label htmlFor="jobBoards">Job Boards</label>
                      <input type="text" id="jobBoards" name="jobBoards" value={clientToEdit.jobBoards || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="jobId">Job ID</label>
                      <input type="text" id="jobId" name="jobId" value={clientToEdit.jobId || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="appliedDate">Applied Date</label>
                      <input type="date" id="appliedDate" name="appliedDate" value={clientToEdit.appliedDate || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                  </div>

                  {/* Education Details */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Education Details</h4>
                    {editableEducationDetails.length > 0 ? (
                      editableEducationDetails.map((edu, index) => (
                        <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                          <h5 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                            Education Entry {index + 1}
                            {editableEducationDetails.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveEducationEntry(index)}
                                style={{ float: 'right', background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            )}
                          </h5>
                          <div className="assign-form-group">
                            <label>University Name</label>
                            <input type="text" name="universityName" value={edu.universityName || ''} onChange={(e) => handleEducationChange(e, index, 'universityName')} readOnly={!isEditingClient} />
                          </div>
                          <div className="assign-form-group">
                            <label>University Address</label>
                            <input type="text" name="universityAddress" value={edu.universityAddress || ''} onChange={(e) => handleEducationChange(e, index, 'universityAddress')} readOnly={!isEditingClient} />
                          </div>
                          <div className="assign-form-group">
                            <label>Course of Study</label>
                            <input type="text" name="courseOfStudy" value={edu.courseOfStudy || ''} onChange={(e) => handleEducationChange(e, index, 'courseOfStudy')} readOnly={!isEditingClient} />
                          </div>
                          <div className="assign-form-group">
                            <label>Graduation From Date</label>
                            <input type="date" name="graduationFromDate" value={edu.graduationFromDate || ''} onChange={(e) => handleEducationChange(e, index, 'graduationFromDate')} readOnly={!isEditingClient} />
                          </div>
                          <div className="assign-form-group">
                            <label>Graduation To Date</label>
                            <input type="date" name="graduationToDate" value={edu.graduationToDate || ''} onChange={(e) => handleEducationChange(e, index, 'graduationToDate')} readOnly={!isEditingClient} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="read-only-value">No education details provided.</div>
                    )}
                    {isEditingClient && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="button" onClick={handleAddEducationEntry} className="assign-form-button assign" style={{ padding: '8px 16px' }}>
                          + Add Education
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Employment Details */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Employment Details</h4>
                    <div className="assign-form-group">
                      <label htmlFor="currentCompany">Current Company</label>
                      <input type="text" id="currentCompany" name="currentCompany" value={clientToEdit.currentCompany || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="currentDesignation">Current Designation</label>
                      <input type="text" id="currentDesignation" name="currentDesignation" value={clientToEdit.currentDesignation || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="noticePeriod">Notice Period</label>
                      <input type="text" id="noticePeriod" name="noticePeriod" value={clientToEdit.noticePeriod || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="preferredInterviewTime">Preferred Interview Time</label>
                      <input type="text" id="preferredInterviewTime" name="preferredInterviewTime" value={clientToEdit.preferredInterviewTime || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="earliestJoiningDate">Earliest Joining Date</label>
                      <input type="date" id="earliestJoiningDate" name="earliestJoiningDate" value={clientToEdit.earliestJoiningDate || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="relievingDate">Relieving Date</label>
                      <input type="date" id="relievingDate" name="relievingDate" value={clientToEdit.relievingDate || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                  </div>

                  {/* References */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">References</h4>
                    <div className="assign-form-group">
                      <label htmlFor="referenceName">Reference Name</label>
                      <input type="text" id="referenceName" name="referenceName" value={clientToEdit.referenceName || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="referencePhone">Reference Phone</label>
                      <input type="tel" id="referencePhone" name="referencePhone" value={clientToEdit.referencePhone || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="referenceAddress">Reference Address</label>
                      <textarea id="referenceAddress" name="referenceAddress" value={clientToEdit.referenceAddress || ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="referenceEmail">Reference Email</label>
                      <input type="email" id="referenceEmail" name="referenceEmail" value={clientToEdit.referenceEmail || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                    <div className="assign-form-group">
                      <label htmlFor="referenceRole">Reference Role</label>
                      <input type="text" id="referenceRole" name="referenceRole" value={clientToEdit.referenceRole || ''} onChange={handleEditClientChange} readOnly={!isEditingClient} />
                    </div>
                  </div>

                  {/* Job Portal Accounts */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Job Portal Accounts</h4>
                    <div className="assign-form-group">
                      <label htmlFor="jobPortalAccountNameandCredentials">Account Name & Credentials</label>
                      <textarea id="jobPortalAccountNameandCredentials" name="jobPortalAccountNameandCredentials" value={clientToEdit.jobPortalAccountNameandCredentials || ''} onChange={handleEditClientChange} readOnly={!isEditingClient}></textarea>
                    </div>
                  </div>

                  {/* NEW: Resume Download Section */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Resume(s)</h4>
                    {isEditingClient ? (
                      // --- EDIT MODE ---
                      <>
                        {clientToEdit?.resumes && clientToEdit.resumes.length > 0 ? (
                          (clientToEdit.resumes || []).map(normalizeResumeItem).filter(Boolean).map((resume, index) => (
                            <div key={index} className="assign-form-group" style={{ paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
                              <label htmlFor={`resume-update-${index}`}>
                                Resume {index + 1}: <span style={{ fontWeight: 'normal', color: 'var(--subtitle-color)' }}>{resume.name}</span>
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                <input
                                  type="file"
                                  id={`resume-update-${index}`}
                                  onChange={(e) => handleIndividualResumeChange(e, index)}
                                  accept=".pdf,.doc,.docx"
                                  style={{ display: 'none' }}
                                />
                                <label htmlFor={`resume-update-${index}`} className="assign-form-button assign" style={{ cursor: 'pointer', margin: 0 }}>
                                  Update File
                                </label>
                                {newResumeFiles[index] && (
                                  <span style={{ fontSize: '0.85rem', color: '#28a745' }}>New: {newResumeFiles[index].name}</span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          // ADDED: Input to add new resumes when none exist
                          <div className="assign-form-group">
                            <label htmlFor="add-new-resumes-manager">Add New Resume(s)</label>
                            <input
                              type="file"
                              id="add-new-resumes-manager"
                              multiple
                              onChange={handleNewResumeUpload}
                              accept=".pdf,.doc,.docx"
                            />
                            {Object.entries(newResumeFiles).map(([key, file]) =>
                              key.startsWith('new_') && <div key={key} style={{ fontSize: '0.85rem', color: '#28a745' }}>Selected: {file.name}</div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      // --- VIEW MODE ---
                      <>
                        {clientToEdit?.resumes && clientToEdit.resumes.length > 0 ? (
                          (clientToEdit.resumes || []).map(normalizeResumeItem).filter(Boolean).map((resume, index) => (
                            <div key={index} className="assign-form-group">
                              <div className="read-only-value" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{resume.name || 'No resume uploaded.'}</span>
                                {resume.url && (
                                  <a href={resume.url} download={resume.name} target="_blank" rel="noopener noreferrer" className="assign-form-button assign" style={{ textDecoration: 'none' }}>Download</a>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="read-only-value">No resumes uploaded.</div>
                        )}
                      </>
                    )}
                  </div>

                  {/* NEW: Cover Letter Section */}
                  <div className="client-preview-section">
                    <h4 className="client-preview-section-title">Cover Letter</h4>
                    {isEditingClient ? (
                      // EDIT MODE VIEW
                      <div className="assign-form-group">
                        <label htmlFor="coverLetterUpload">Upload New Cover Letter (optional)</label>
                        {newCoverLetterFile ? (
                          <p style={{ fontSize: '0.9em', color: '#28a745' }}>
                            New file selected: <strong>{newCoverLetterFile.name}</strong>
                          </p>
                        ) : (
                          <p style={{ fontSize: '0.9em', color: 'var(--subtitle-color)' }}>
                            Current file: {clientToEdit.coverLetterFileName ? (
                              <a href={clientToEdit.coverLetterUrl} target="_blank" rel="noopener noreferrer">
                                {clientToEdit.coverLetterFileName}
                              </a>
                            ) : 'No cover letter on file.'}
                          </p>
                        )}

                      </div>
                    ) : (
                      // VIEW-ONLY MODE
                      <div className="assign-form-group">
                        <label>File Name</label>
                        <div className="read-only-value" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{clientToEdit.coverLetterFileName || 'No cover letter uploaded.'}</span>
                          {clientToEdit.coverLetterUrl && (
                            <a
                              href={clientToEdit.coverLetterUrl}
                              download={clientToEdit.coverLetterFileName}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="assign-form-button assign"
                              style={{ textDecoration: 'none' }}
                            >
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Skills section for editing */}
                {clientToEdit.skills && (
                  <div className="client-preview-skills-section">
                    <h4 className="assign-modal-title" style={{ marginBottom: '10px', fontSize: '18px' }}>Skills (Comma Separated)</h4>
                    <div className="assign-form-group">
                      <textarea
                        id="skills"
                        name="skills"
                        value={Array.isArray(clientToEdit.skills) ? clientToEdit.skills.join(', ') : clientToEdit.skills || ''}
                        onChange={(e) => setClientToEdit(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
                        readOnly={!isEditingClient}
                      ></textarea>
                    </div>
                  </div>
                )}
              </> // FIX: Closing fragment tag was missing
            )}

            <div className="assign-form-actions">
              <button className="assign-form-button cancel" onClick={closeEditClientModal}>
                Cancel
              </button>
              {isEditingClient ? (
                <button className="assign-form-button assign" onClick={handleUpdateClient} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span style={{ marginLeft: '8px' }}>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              ) : (
                <button className="assign-form-button assign" onClick={() => setIsEditingClient(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Create New employee Account Modal */}
      {isAddEmployeeModalOpen && (
        <div className="modal-overlay open">
          <div className="assign-modal-content">
            <div className="assign-modal-header">
              <h3 className="assign-modal-title">Add New Employee</h3>
              <button className="assign-modal-close-button" onClick={handleCloseAddEmployeeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="client-preview-grid-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                <div className="assign-form-group" style={{ flex: 1 }}>
                  <label>First Name</label>
                  <input type="text" name="firstName" value={newEmployee.firstName} onChange={handleNewEmployeeChange} required />
                </div>
                <div className="assign-form-group" style={{ flex: 1 }}>
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={newEmployee.lastName} onChange={handleNewEmployeeChange} required />
                </div>
              </div>

              <div className="assign-form-group">
                <label>Work Email</label>
                <input type="email" name="workEmail" value={newEmployee.workEmail} onChange={handleNewEmployeeChange} required />
              </div>

              <div className="assign-form-group">
                <label>Department</label>
                <select name="department" value={newEmployee.department} onChange={handleNewEmployeeChange}>
                  <option value="">Select Department</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div className="assign-form-group" style={{ position: 'relative' }}>
                <label>Temporary Password</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" name="temporaryPassword" value={newEmployee.temporaryPassword} onChange={handleNewEmployeeChange} required />
                  <button type="button" onClick={generateTemporaryPassword} className="modal-assign-button" style={{ width: 'auto', padding: '0 10px', fontSize: '12px', minWidth: 'unset' }}>Generate</button>
                </div>
              </div>

              <div className="assign-form-actions">
                <button type="button" className="assign-form-button cancel" onClick={handleCloseAddEmployeeModal}>Cancel</button>
                <button type="submit" className="assign-form-button assign" disabled={isCreatingEmployee}>
                  {isCreatingEmployee ? 'Creating...' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    