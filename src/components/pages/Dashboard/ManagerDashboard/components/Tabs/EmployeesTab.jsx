import React from 'react';

const EmployeesTab = ({
  totalAssignedClientsByEmployee,
  setIsAddEmployeeModalOpen,
  assignedEmployeeSearchQuery,
  handleAssignedEmployeeSearchChange,
  filteredEmployees,
  getInitials,
  assignedClients,
  openEmployeeClientsModal
}) => {
  return (
    <section className="assigned-employee-overview client-assignment-overview">
      <div className="client-assignment-header">
        <h2 className="client-assignment-title">My Employees</h2>
        <div className="clients-count-badge">
          Total {totalAssignedClientsByEmployee} clients
        </div>
        <button className="assign-client-button" onClick={() => setIsAddEmployeeModalOpen(true)}>
          <i className="fas fa-user-plus"></i> Add Employee
        </button>
      </div>

      <div className="applications-filters assigned-employee-search-bar" style={{ marginBottom: '20px' }}>
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search employees..."
            value={assignedEmployeeSearchQuery}
            onChange={handleAssignedEmployeeSearchChange}
          />
        </div>
      </div>

      <div className="employee-cards-grid">
        {filteredEmployees.map((employee) => (
          <div key={employee.firebaseKey} className="employee-card">
            <div className="employee-card-header">
              <div className="employee-avatar-large">{getInitials(employee.fullName)}</div>
              <div className="employee-info">
                <div className="employee-name">{employee.fullName}</div>
                <div className="employee-role">{employee.role}</div>
              </div>
              <div className="clients-count-badge">
                {assignedClients.filter(c => c.assignedTo === employee.firebaseKey).length} clients
              </div>
            </div>
            <div className="employee-card-details">
              <div className="success-rate">Success Rate: <span className="success-rate-value">{employee.successRate}%</span></div>&nbsp;
              <button className="view-employee-details-button" onClick={() => openEmployeeClientsModal(employee)}>
                <i className="fas fa-eye"></i>View Client
              </button>
            </div>
          </div>
        ))}
        {filteredEmployees.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-color)', gridColumn: '1 / -1' }}>
            No employees assigned to your clients.
          </p>
        )}
      </div>
    </section>
  );
};

export default EmployeesTab;
