{activeTab === 'Applications' && (
          <ApplicationsTab
            applicationData={filteredApplicationData}
            employees={displayEmployees}
            uniqueClientNames={uniqueAssignedClientNames}
            applicationFilterEmployee={applicationFilterEmployee}
            handleApplicationFilterEmployeeChange={handleApplicationFilterEmployeeChange}
            applicationFilterClient={applicationFilterClient}
            handleApplicationFilterClientChange={handleApplicationFilterClientChange}
            clientStatusFilter={clientStatusFilter}
            handleClientStatusFilterChange={handleClientStatusFilterChange}
            filterDateRange={filterDateRange}
            handleDateRangeChange={handleDateRangeChange}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            quickFilter={quickFilter}
            handleQuickFilterChange={handleQuickFilterChange}
            areFiltersActive={areApplicationsFiltersActive}
            handleClearFilters={handleClearApplicationsFilters}
            dailyApplicationCount={applicationCounts.todayCount}
            filteredApplicationCount={applicationCounts.filteredCount}
            selectedEmployeeDailyCount={applicationCounts.employeeTodayCount}
            applicationFilterDateRange={applicationFilterDateRange}
            downloadApplicationsData={downloadManagerApplicationsData}
            applicationSearchQuery={applicationSearchQuery}
            setApplicationSearchQuery={setApplicationSearchQuery}
          />

        )}

        {showAttachmentModal && (
          <AttachmentModal
            attachments={currentAttachments}
            onClose={closeAttachmentModal}
          />
        )}

        