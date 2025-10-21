const statusFields = [
  "application_sent",
  "application_returned",
  "cheque_received",
  "cheque_lodged"
];

const ApplicantList = ({ applicants, onUpdate, onDelete }) => (
  <div>
    {applicants.length === 0 ? (
      <div className="text-center py-16 text-slate-400">No applicants yet</div>
    ) : (
      <table className="min-w-full border border-slate-200 bg-white rounded-lg">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Eircode</th>
            <th>Phone</th>
            <th>Application Sent</th>
            <th>Application Returned</th>
            <th>Cheque Received</th>
            <th>Cheque Lodged</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(applicant => {
            const stepsComplete = statusFields.map(f => applicant[f]).filter(Boolean).length;
            const totalSteps = statusFields.length;
            const percent = Math.round((stepsComplete / totalSteps) * 100);

            return (
              <tr key={applicant.id}>
                <td>{applicant.name}</td>
                <td>{applicant.address}</td>
                <td>{applicant.eircode}</td>
                <td>{applicant.phone}</td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!applicant.application_sent}
                    onChange={e => onUpdate(applicant.id, { application_sent: e.target.checked })}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!applicant.application_returned}
                    onChange={e => onUpdate(applicant.id, { application_returned: e.target.checked })}
                  />
                </td>
               <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!applicant.cheque_received}
                    onChange={e => onUpdate(applicant.id, { cheque_received: e.target.checked })}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!applicant.cheque_lodged}
                    onChange={e => onUpdate(applicant.id, { cheque_lodged: e.target.checked })}
                  />
                </td>
                <td style={{ minWidth: 100 }}>
                  <div style={{ width: "100%", background: "#eee", borderRadius: 5, height: 8 }}>
                    <div style={{
                      width: `${percent}%`,
                      background: "#10B981",
                      height: 8,
                      borderRadius: 5
                    }} />
                  </div>
                  <div style={{ fontSize: 12, textAlign: "center", color: "#555" }}>{percent}%</div>
                </td>
                <td>
                  <button
                    onClick={() => onDelete(applicant.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
);

export default ApplicantList;
