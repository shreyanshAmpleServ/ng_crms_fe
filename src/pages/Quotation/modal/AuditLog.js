import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  User,
  Edit3,
  Plus,
  Trash2,
  ShoppingCart,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { fetchAuditLog } from '../../../redux/quotation';
import { useDispatch } from 'react-redux';

const QuotationAuditLog = ({id}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const dispatch = useDispatch()

  const auditLogData = [
    {
      id: 1,
      table_name: 'Quotation',
      record_id: 1001,
      column_name: 'vendor_id',
      old_value: 'Vendor ABC Corp',
      new_value: 'Vendor XYZ Ltd',
      createdby: 1,
      createdate: '2024-08-04T10:30:00Z',
      user_name: 'John Doe',
      user_avatar: 'JD'
    },
    {
      id: 2,
      table_name: 'Quotation',
      record_id: 1001,
      column_name: 'currency',
      old_value: 'USD',
      new_value: 'EUR',
      createdby: 1,
      createdate: '2024-08-04T10:30:00Z',
      user_name: 'John Doe',
      user_avatar: 'JD'
    },
    {
      id: 3,
      table_name: 'Quotation',
      record_id: 1001,
      column_name: 'quotation_items.quantity',
      old_value: '10',
      new_value: '15',
      createdby: 2,
      createdate: '2024-08-04T11:15:00Z',
      user_name: 'Jane Smith',
      user_avatar: 'JS'
    },
    {
      id: 4,
      table_name: 'Quotation',
      record_id: 1001,
      column_name: 'quotation_items.rate',
      old_value: '$100.00',
      new_value: '$120.00',
      createdby: 2,
      createdate: '2024-08-04T11:15:00Z',
      user_name: 'Jane Smith',
      user_avatar: 'JS'
    },
    {
      id: 5,
      table_name: 'Quotation',
      record_id: 1001,
      column_name: 'quotation_items',
      old_value: '-',
      new_value: 'Premium Laptop Item',
      createdby: 1,
      createdate: '2024-08-04T14:20:00Z',
      user_name: 'John Doe',
      user_avatar: 'JD'
    },
    {
      id: 6,
      table_name: 'Quotation',
      record_id: 1001,
      column_name: 'quotation_items',
      old_value: 'Old Monitor Item',
      new_value: '-',
      createdby: 2,
      createdate: '2024-08-04T15:45:00Z',
      user_name: 'Jane Smith',
      user_avatar: 'JS'
    },
    {
      id: 7,
      table_name: 'Quotation',
      record_id: 1001,
      column_name: 'status',
      old_value: 'Draft',
      new_value: 'Approved',
      createdby: 3,
      createdate: '2024-08-04T16:30:00Z',
      user_name: 'Mike Johnson',
      user_avatar: 'MJ'
    },
    {
      id: 8,
      table_name: 'Quotation',
      record_id: 1001,
      column_name: 'due_date',
      old_value: '2024-08-15',
      new_value: '2024-08-20',
      createdby: 1,
      createdate: '2024-08-04T17:10:00Z',
      user_name: 'John Doe',
      user_avatar: 'JD'
    }
  ];
  React.useEffect(() => {
    id && dispatch(fetchAuditLog({id}))
  }, [dispatch,id]);
  const { quotations ,auditLog, loading, error, success } = useSelector(
    (state) => state.quotations,
  );
  const getActionType = (columnName, oldValue, newValue) => {
    if (oldValue === '-' && newValue !== '-') return 'CREATE';
    if (oldValue !== '-' && newValue === '-') return 'DELETE';
    return 'UPDATE';
  };
console.log("Quotation",auditLog, quotations?.auditLog)
  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'CREATE':
        return <Plus size={16} />;
      case 'DELETE':
        return <Trash2 size={16} />;
      default:
        return <Edit3 size={16} />;
    }
  };

  const formatFieldName = (columnName) => {
    return columnName
      .split('.')
      .map(part =>
        part
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
      .join(' • ');
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredData = useMemo(() => {
    return auditLogData.filter(entry => {
      const matchesSearch =
        entry?.column_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry?.old_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry?.new_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry?.user_name.toLowerCase().includes(searchTerm.toLowerCase());

      const actionType = getActionType(entry?.column_name, entry?.old_value, entry?.new_value);
      const matchesAction = selectedAction === 'all' || actionType === selectedAction;

      return matchesSearch && matchesAction;
    });
  }, [auditLogData, searchTerm, selectedAction]);

  const getBadgeClass = (actionType) => {
    switch (actionType) {
      case 'CREATE':
        return 'bg-success text-white';
      case 'DELETE':
        return 'bg-danger text-white';
      default:
        return 'bg-purple text-white';
    }
  };
  const getStatus = (status) => {
    switch (status) {
      case 'O':
        return 'Open';
      case 'L':
        return 'Closed';
      case 'C':
        return 'Canceled';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="container  p-1">
      {/* <div className="text-center mb-5">
        <div className="mb-3">
          <Clock size={32} className="text-primary" />
        </div>
        <h3 className="fw-bold">Quotation Activity Timeline</h3>
        <p className="text-muted">Track every change with beautiful precision</p>
      </div> */}

      {/* Search & Filter */}
      {/* <div className="card shadow-sm p-4 mb-4">
        <div className="row g-3">
          <div className="col-md">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search changes, fields, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-auto">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <Filter size={16} />
              </span>
              <select
                className="form-select"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
              >
                <option value="all">All Activities</option>
                <option value="updated">Updates</option>
                <option value="CREATE">Created</option>
                <option value="DELETE">Deleted</option>
              </select>
            </div>
          </div>
        </div>
      </div> */}

      {/* Activity Logs */}
      <div className="vstack gap-3">
        {auditLog?.data?.length === 0 ? (
          <div className="card p-5 text-center text-muted shadow-sm">
            <Search size={32} className="mb-3" />
            <h5>No activities found</h5>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
            auditLog?.data && auditLog?.data.map((entry) => {
            // const actionType = getActionType(entry?.column_name, entry?.old_value, entry?.new_value);
            return (
              <div key={entry?.id} className={`card ${entry?.action === "CREATE" ? "bg-success-light-gradient"  : entry?.action === "DELETE" ? "bg-danger-light-gradient" : "bg-light-gradient"} border border-black shadow-lg mb-0 p-4`}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div className="d-flex align-items-center gap-3">
                    <div className={`badge ${getBadgeClass(entry?.action)} p-2`}>
                      {getActionIcon(entry?.action)}
                    </div>
                    <div>
                      <h6 className="mb-0 text-capitalize">
                        {entry?.action} {formatFieldName(entry?.obj_name)}
                      </h6>
                      <small className="text-muted">#{entry?.id}</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-purple-gradient text-black d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: 12 }}>
                     { "QA" || entry?.obj_name}
                    </div>
                    <div>
                      <div className="fw-medium text-black">{entry?.obj_name}</div>
                      <div className="text-muted small">{formatDateTime(entry?.updated_at)}</div>
                    </div>
                  </div>
                </div>

                {/* Change Values */}
                {entry?.action === 'UPDATE' && Array.isArray(JSON.parse(entry?.new_value || '[]')) &&
  JSON.parse(entry.new_value)?.map((item)=>

                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    
                    <div className="bg-light border border-danger-subtle rounded p-2 d-flex align-items-center gap-2">
                      <small className="text-danger fw-bold">FROM</small>
                      <code className="text-danger">{item?.field == "status" ? getStatus(item?.oldValue) : item?.oldValue || '(empty)'}</code>
                    </div>
                    <ArrowRight size={16} className="text-muted" />
                    <div className="bg-light border border-success-subtle rounded p-2 d-flex align-items-center gap-2">
                      <small className="text-success fw-bold">TO</small>
                      <code className="text-success">{item?.field == "status" ? getStatus(item?.oldValue) : item?.newValue || '(empty)'}</code>
                    </div>
                    <div className="bg-light border border-danger-subtle rounded p-2 d-flex align-items-center gap-2">
                      <small className="text-danger fw-bold text-capitalize">  {item?.field?.replace(/_/g, ' ')}</small>
                      {/* <code className="text-danger">{item?.oldValue || '(empty)'}</code> */}
                    </div>
                  </div>
                )}

                {entry?.action === 'CREATE' && (
                  <div className="bg-light border border-success-subtle rounded p-2 d-inline-flex align-items-center gap-2 mt-2">
                    <Plus size={16} className="text-success" />
                    <code className="text-success">{JSON.parse(entry?.new_value)?.item_name}</code>
                  </div>
                )}

                {entry?.action === 'DELETE' && Array.isArray(JSON.parse(entry?.new_value || '[]')) &&
  JSON.parse(entry.new_value)?.map((item)=>
                  <div className="bg-light border border-danger-subtle rounded p-2 d-inline-flex align-items-center gap-2 mt-2">
                    <Trash2 size={16} className="text-danger" />
                    <code className="text-danger">{item?.item_name}</code>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {/* Activity Logs */}
      {/* <div className="vstack gap-3">
        {filteredData.length === 0 ? (
          <div className="card p-5 text-center text-muted shadow-sm">
            <Search size={32} className="mb-3" />
            <h5>No activities found</h5>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredData.map((entry) => {
            const actionType = getActionType(entry?.column_name, entry?.old_value, entry?.new_value);
            return (
              <div key={entry?.id} className={`card ${actionType === "CREATE" ? "bg-success-light-gradient"  : actionType === "DELETE" ? "bg-danger-light-gradient" : "bg-light-gradient"} border border-black shadow-lg mb-0 p-4`}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div className="d-flex align-items-center gap-3">
                    <div className={`badge ${getBadgeClass(actionType)} p-2`}>
                      {getActionIcon(actionType)}
                    </div>
                    <div>
                      <h6 className="mb-0 text-capitalize">
                        {actionType} {formatFieldName(entry?.obj_name)}
                      </h6>
                      <small className="text-muted">#{entry?.record_id}</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-purple-gradient text-black d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: 12 }}>
                      {entry?.user_avatar}
                    </div>
                    <div>
                      <div className="fw-medium text-black">{entry?.user_name}</div>
                      <div className="text-muted small">{formatDateTime(entry?.createdate)}</div>
                    </div>
                  </div>
                </div>

                {actionType === 'UPDATE' && (
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <div className="bg-light border border-danger-subtle rounded p-2 d-flex align-items-center gap-2">
                      <small className="text-danger fw-bold">FROM</small>
                      <code className="text-danger">{entry?.old_value || '(empty)'}</code>
                    </div>
                    <ArrowRight size={16} className="text-muted" />
                    <div className="bg-light border border-success-subtle rounded p-2 d-flex align-items-center gap-2">
                      <small className="text-success fw-bold">TO</small>
                      <code className="text-success">{entry?.new_value || '(empty)'}</code>
                    </div>
                  </div>
                )}

                {actionType === 'CREATE' && (
                  <div className="bg-light border border-success-subtle rounded p-2 d-inline-flex align-items-center gap-2 mt-2">
                    <Plus size={16} className="text-success" />
                    <code className="text-success">{entry?.new_value}</code>
                  </div>
                )}

                {actionType === 'DELETE' && (
                  <div className="bg-light border border-danger-subtle rounded p-2 d-inline-flex align-items-center gap-2 mt-2">
                    <Trash2 size={16} className="text-danger" />
                    <code className="text-danger">{entry?.old_value}</code>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div> */}

      {/* Footer Stats */}
      {/* <div className="card p-3 mt-5 shadow-sm">
        <div className="d-flex justify-content-between">
          <div className="d-flex gap-4">
            <span className="d-flex align-items-center gap-2 text-success">
              <span className="badge bg-success rounded-circle" style={{ width: 8, height: 8 }}></span>
              Created
            </span>
            <span className="d-flex align-items-center gap-2 text-primary">
              <span className="badge bg-primary rounded-circle" style={{ width: 8, height: 8 }}></span>
              Updated
            </span>
            <span className="d-flex align-items-center gap-2 text-danger">
              <span className="badge bg-danger rounded-circle" style={{ width: 8, height: 8 }}></span>
              Deleted
            </span>
          </div>
          <div className="text-muted">
            {filteredData.length} of {auditLogData.length} activities
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default QuotationAuditLog;