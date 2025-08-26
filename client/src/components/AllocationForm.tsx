import React, { useState, useEffect } from 'react';
import './AllocationForm.css';

interface Job {
  id: number;
  erp_job_id: string;
  name: string;
  active_flag: boolean;
  is_out_of_state: boolean;
  home_state: string;
  job_state: string;
}

interface Phase {
  id: number;
  job_id: number;
  code: string;
  name: string;
  active_flag: boolean;
}

interface Equipment {
  id: number;
  equipment_id: string;
  name: string;
  active_flag: boolean;
}

interface CostCode {
  id: number;
  code: string;
  name: string;
  active_flag: boolean;
}

interface AllocationLine {
  id: string;
  job_type: 'job' | 'mechanic';
  job_id: string;
  phase_id: string;
  equipment_id: string;
  cost_code_id: string;
  percentage: string;
  work_location: 'onsite' | 'remote' | '';
}

interface Week {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
}

const AllocationForm: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [phases, setPhases] = useState<{ [key: string]: Phase[] }>({});
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [costCodes, setCostCodes] = useState<CostCode[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
  const [allocations, setAllocations] = useState<AllocationLine[]>([
    { id: '1', job_type: 'job', job_id: '', phase_id: '', equipment_id: '', cost_code_id: '', percentage: '', work_location: '' }
  ]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [employee] = useState({ id: 1, name: 'George Makakaufaki', department: '' });
  const [bulkJobInput, setBulkJobInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [inputMode, setInputMode] = useState<'percentage' | 'hours'>('percentage');
  const [totalHours, setTotalHours] = useState(50); // 40 regular + 10 overtime
  const [regularHours] = useState(40);
  const [overtimeHours] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchCurrentWeek(), fetchEquipment(), fetchCostCodes()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const total = allocations.reduce((sum, allocation) => {
      return sum + (parseFloat(allocation.percentage) || 0);
    }, 0);
    setTotalPercentage(total);
  }, [allocations]);

  const convertPercentageToHours = (percentage: number) => {
    return (percentage / 100) * totalHours;
  };

  const convertHoursToPercentage = (hours: number) => {
    return (hours / totalHours) * 100;
  };

  const getTotalHours = () => {
    return (totalPercentage / 100) * totalHours;
  };

  const formatDisplayValue = (percentage: string) => {
    if (!percentage) return '';
    if (inputMode === 'hours') {
      const hours = convertPercentageToHours(parseFloat(percentage));
      // Remove unnecessary trailing zeros and decimal points
      return hours % 1 === 0 ? hours.toString() : hours.toFixed(1);
    }
    return percentage;
  };

  const parseInputValue = (value: string) => {
    if (!value) return '';
    if (inputMode === 'hours') {
      return convertHoursToPercentage(parseFloat(value)).toFixed(2);
    }
    return value;
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      if (!response.ok) throw new Error('Failed to load jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setMessage({ type: 'error', text: 'Failed to load job data. Please refresh the page.' });
    }
  };

  const fetchPhases = async (jobId: string) => {
    if (!jobId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/phases/${jobId}`);
      const data = await response.json();
      setPhases(prev => ({ ...prev, [jobId]: data }));
    return data;
    } catch (error) {
      console.error('Error fetching phases:', error);
    }
  };

  const fetchCurrentWeek = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/current-week');
      if (!response.ok) throw new Error('Failed to load week data');
      const data = await response.json();
      setCurrentWeek(data);
    } catch (error) {
      console.error('Error fetching current week:', error);
      setMessage({ type: 'error', text: 'Failed to load week information. Please refresh the page.' });
    }
  };

  const addAllocationLine = () => {
    const newId = (allocations.length + 1).toString();
    setAllocations([...allocations, { 
      id: newId, 
      job_type: 'job',
      job_id: '', 
      phase_id: '', 
      equipment_id: '',
      cost_code_id: '',
      percentage: '', 
      work_location: '' 
    }]);
  };

  const removeAllocationLine = (id: string) => {
    if (allocations.length > 1) {
      setAllocations(allocations.filter(allocation => allocation.id !== id));
    }
  };

  const updateAllocation = (id: string, field: keyof AllocationLine, value: string | boolean) => {
    setAllocations(allocations.map(allocation => {
      if (allocation.id === id) {
        const updated = { ...allocation, [field]: value };
        
        // If job changes, reset phase and fetch new phases
        if (field === 'job_id' && typeof value === 'string') {
          updated.phase_id = '';
          if (value) {
            fetchPhases(value);
          }
        }

        // Handle job type changes
        if (field === 'job_type') {
          updated.job_id = '';
          updated.phase_id = '';
          updated.equipment_id = '';
          updated.cost_code_id = '';
          updated.work_location = '';
        }
        
        // If job changes, reset related fields
        if (field === 'job_id' && typeof value === 'string' && value) {
          const selectedJob = jobs.find(j => j.id.toString() === value);
          updated.work_location = selectedJob?.is_out_of_state ? 'onsite' : '';
        }

        return updated;
      }
      return allocation;
    }));
  };

  const handleSubmit = async () => {
    if (Math.abs(totalPercentage - 100) > 0.01) {
      const errorText = inputMode === 'hours' 
        ? `Total allocation must equal exactly ${totalHours} hours`
        : 'Total allocation must equal exactly 100.00%';
      setMessage({ type: 'error', text: errorText });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          week_id: currentWeek?.id,
          allocations: allocations,
          status: 'submitted'
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Time allocation submitted successfully! Your manager will be notified.' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting allocation:', error);
      setMessage({ type: 'error', text: 'Failed to submit allocation. Please try again or contact IT support.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          week_id: currentWeek?.id,
          allocations: allocations,
          status: 'draft'
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Draft saved successfully!' });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setMessage({ type: 'error', text: 'Failed to save draft. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/equipment');
      if (!response.ok) throw new Error('Failed to load equipment');
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setMessage({ type: 'error', text: 'Failed to load equipment data. Please refresh the page.' });
    }
  };

  const fetchCostCodes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cost-codes');
      if (!response.ok) throw new Error('Failed to load cost codes');
      const data = await response.json();
      setCostCodes(data);
    } catch (error) {
      console.error('Error fetching cost codes:', error);
      setMessage({ type: 'error', text: 'Failed to load cost code data. Please refresh the page.' });
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const loadPreviousAllocation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/previous-allocation');
      if (!response.ok) throw new Error('Failed to load previous allocation');
      const data = await response.json();
      
      // Load phases for each job in previous allocation
      const uniqueJobIds = Array.from(new Set(data.allocations.map((a: AllocationLine) => a.job_id)));
      await Promise.all(uniqueJobIds.map(jobId => fetchPhases(jobId as string)));
      
      setAllocations(data.allocations.map((allocation: AllocationLine, index: number) => ({
        ...allocation,
        id: (index + 1).toString()
      })));
      
      setMessage({ type: 'success', text: 'Previous week allocation loaded successfully!' });
    } catch (error) {
      console.error('Error loading previous allocation:', error);
      setMessage({ type: 'error', text: 'Failed to load previous allocation. Please try again.' });
    }
  };

  const distributeEvenly = () => {
    const nonEmptyLines = allocations.filter(a => 
      (a.job_type === 'job' && a.job_id && a.phase_id) ||
      (a.job_type === 'mechanic' && a.equipment_id && a.cost_code_id)
    );
    if (nonEmptyLines.length === 0) return;
    
    const evenPercentage = (100 / nonEmptyLines.length).toFixed(2);
    const updatedAllocations = allocations.map(allocation => {
      if ((allocation.job_type === 'job' && allocation.job_id && allocation.phase_id) ||
          (allocation.job_type === 'mechanic' && allocation.equipment_id && allocation.cost_code_id)) {
        return { ...allocation, percentage: evenPercentage };
      }
      return allocation;
    });
    
    setAllocations(updatedAllocations);
    const modeText = inputMode === 'hours' ? 'hours' : 'percentages';
    setMessage({ type: 'success', text: `${modeText.charAt(0).toUpperCase() + modeText.slice(1)} distributed evenly across all lines!` });
  };

  const fillToHundred = () => {
    const currentTotal = allocations.reduce((sum, allocation) => {
      return sum + (parseFloat(allocation.percentage) || 0);
    }, 0);
    
    if (currentTotal >= 100) {
      setMessage({ type: 'error', text: 'Total is already 100% or more.' });
      return;
    }
    
    const remaining = 100 - currentTotal;
    const lastValidLine = allocations.reverse().find(a => 
      (a.job_type === 'job' && a.job_id && a.phase_id) ||
      (a.job_type === 'mechanic' && a.equipment_id && a.cost_code_id)
    ) || null;
    allocations.reverse(); // restore original order
    
    if (!lastValidLine) {
      setMessage({ type: 'error', text: 'No valid allocation lines to fill.' });
      return;
    }
    
    const updatedAllocations = allocations.map(allocation => {
      if (allocation.id === lastValidLine.id) {
        const newPercentage = (parseFloat(allocation.percentage) || 0) + remaining;
        return { ...allocation, percentage: newPercentage.toFixed(2) };
      }
      return allocation;
    });
    
    setAllocations(updatedAllocations);
    const modeText = inputMode === 'hours' ? `${convertPercentageToHours(remaining).toFixed(1)} hours` : `${remaining.toFixed(2)}%`;
    setMessage({ type: 'success', text: `Added ${modeText} to complete ${inputMode === 'hours' ? totalHours : '100%'}!` });
  };

  const processBulkJobs = async () => {
    if (!bulkJobInput.trim()) return;
    
    const jobNumbers = bulkJobInput
      .split(/[,\s]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const newAllocations: AllocationLine[] = [];
    let startId = allocations.length;
    
    for (const jobNumber of jobNumbers) {
      const job = jobs.find(j => j.erp_job_id === jobNumber);
      if (job) {
        startId++;
        const phases = await fetchPhases(job.id.toString());
        const firstPhase = phases && phases.length > 0 ? phases[0] : null;
        
        newAllocations.push({
          id: startId.toString(),
          job_type: 'job',
          job_id: job.id.toString(),
          phase_id: firstPhase ? firstPhase.id.toString() : '',
          equipment_id: '',
          cost_code_id: '',
          percentage: '',
          work_location: job.is_out_of_state ? 'onsite' : ''
        });
      }
    }
    
    if (newAllocations.length > 0) {
      setAllocations(prev => [...prev, ...newAllocations]);
      setMessage({ type: 'success', text: `Added ${newAllocations.length} job allocation lines!` });
      setBulkJobInput('');
      setShowBulkInput(false);
    } else {
      setMessage({ type: 'error', text: 'No valid job numbers found. Please check and try again.' });
    }
  };

  const formatWeekRange = (week: Week) => {
    const start = new Date(week.start_date).toLocaleDateString();
    const end = new Date(week.end_date).toLocaleDateString();
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="allocation-form loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your allocation form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="allocation-form">
      <div className="employee-info">
        <div className="employee-details">
          <h3>▣ {employee.name}</h3>
        </div>
        <div className="allocation-status">
          <span className="status-badge draft">• Draft</span>
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          <div className="message-content">
            <span>{message.type === 'success' ? '●' : '▲'}</span>
            {message.text}
          </div>
          <button className="message-close" onClick={clearMessage}>×</button>
        </div>
      )}

      {currentWeek && (
        <div className="week-header">
          <h2>Week of {formatWeekRange(currentWeek)}</h2>
          <p className="week-status">Status: <span className="open">Open for Submissions</span></p>
        </div>
      )}

      <div className="form-controls">
        <div className="control-group">
          <button 
            className="add-line-btn"
            onClick={addAllocationLine}
          >
  ▸ Add Line
          </button>
          <button 
            className="previous-btn"
            onClick={loadPreviousAllocation}
          >
  ◄ Copy Last Week
          </button>
          <button 
            className="bulk-btn"
            onClick={() => setShowBulkInput(!showBulkInput)}
          >
  ▼ Bulk Add Jobs
          </button>
        </div>
        
        <div className="percentage-controls">
          <button 
            className="distribute-btn"
            onClick={distributeEvenly}
            disabled={allocations.filter(a => 
              (a.job_type === 'job' && a.job_id && a.phase_id) ||
              (a.job_type === 'mechanic' && a.equipment_id && a.cost_code_id)
            ).length === 0}
          >
  ⟺ Distribute Evenly
          </button>
          <button 
            className="fill-btn"
            onClick={fillToHundred}
            disabled={totalPercentage >= 100}
          >
  ▲ Fill to 100%
          </button>
        </div>
        
        <div className="total-display">
          <div className="input-mode-toggle">
            <button 
              className={`toggle-btn ${inputMode === 'percentage' ? 'active' : ''}`}
              onClick={() => setInputMode('percentage')}
            >
              % Percentage
            </button>
            <button 
              className={`toggle-btn ${inputMode === 'hours' ? 'active' : ''}`}
              onClick={() => setInputMode('hours')}
            >
  ◗ Hours
            </button>
          </div>
          
          {inputMode === 'hours' && (
            <div className="hours-summary">
              <div className="total-hours-display">
                <strong>Total: {totalHours} hrs</strong>
                <div className="hours-breakdown">
                  <span className="regular">Regular: {regularHours}hrs</span>
                  <span className="overtime">OT: {overtimeHours}hrs</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className={`progress-fill ${
                  totalPercentage > 100 ? 'over' : 
                  Math.abs(totalPercentage - 100) < 0.1 ? 'complete' : 
                  totalPercentage >= 80 ? 'high' : 'normal'
                }`}
                style={{ width: `${Math.min(totalPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {inputMode === 'hours' ? (
                <><strong>{getTotalHours().toFixed(1)} / {totalHours} hrs</strong> allocated</>
              ) : (
                <><strong>{totalPercentage.toFixed(1)}%</strong> allocated</>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showBulkInput && (
        <div className="bulk-input-section">
          <div className="bulk-input-header">
            <h4>▼ Bulk Add Jobs</h4>
            <p>Enter job numbers separated by commas or spaces (e.g., "3012, 3025, 3048")</p>
          </div>
          <div className="bulk-input-controls">
            <input
              type="text"
              placeholder="e.g., 3012, 3025, 3048"
              value={bulkJobInput}
              onChange={(e) => setBulkJobInput(e.target.value)}
              className="bulk-input-field"
            />
            <button 
              className="bulk-process-btn"
              onClick={processBulkJobs}
              disabled={!bulkJobInput.trim()}
            >
              ▸ Add Jobs
            </button>
            <button 
              className="bulk-cancel-btn"
              onClick={() => {
                setShowBulkInput(false);
                setBulkJobInput('');
              }}
            >
              × Cancel
            </button>
          </div>
        </div>
      )}

      <div className="allocation-table">
        <div className="table-header">
          <div>◆ Type</div>
          <div>▤ Job/Equipment</div>
          <div>▦ Phase/Cost Code</div>
          <div>▧ {inputMode === 'hours' ? 'Hours' : '% Allocation'}</div>
          <div>◑ Work Location</div>
          <div>▸ Actions</div>
        </div>
        
        <div className="location-help">
          <small>▸ <strong>On-site:</strong> Physically working in the job's state • <strong>Remote:</strong> Working from home state</small>
        </div>

        {allocations.map((allocation) => (
          <div key={allocation.id} className="allocation-row">
            {/* Job Type Column */}
            <div className="job-type-toggle">
              <div className="type-toggle">
                <button 
                  className={`toggle-btn ${allocation.job_type === 'job' ? 'active' : ''}`}
                  onClick={() => updateAllocation(allocation.id, 'job_type', 'job')}
                  type="button"
                >
                  Job
                </button>
                <button 
                  className={`toggle-btn ${allocation.job_type === 'mechanic' ? 'active' : ''}`}
                  onClick={() => updateAllocation(allocation.id, 'job_type', 'mechanic')}
                  type="button"
                >
                  Mechanic
                </button>
              </div>
            </div>

            {/* Job/Equipment Column */}
            <div className="job-equipment-select">
              {allocation.job_type === 'job' ? (
                <select
                  value={allocation.job_id}
                  onChange={(e) => updateAllocation(allocation.id, 'job_id', e.target.value)}
                >
                  <option value="">Select Job</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.erp_job_id} - {job.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={allocation.equipment_id}
                  onChange={(e) => updateAllocation(allocation.id, 'equipment_id', e.target.value)}
                >
                  <option value="">Select Equipment</option>
                  {equipment.map((equip) => (
                    <option key={equip.id} value={equip.id}>
                      {equip.equipment_id} - {equip.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Phase/Cost Code Column */}
            <div className="phase-costcode-select">
              {allocation.job_type === 'job' ? (
                <select
                  value={allocation.phase_id}
                  onChange={(e) => updateAllocation(allocation.id, 'phase_id', e.target.value)}
                  disabled={!allocation.job_id}
                >
                  <option value="">Select Phase</option>
                  {allocation.job_id && phases[allocation.job_id] && 
                    phases[allocation.job_id].map((phase) => (
                      <option key={phase.id} value={phase.id}>
                        {phase.code} - {phase.name}
                      </option>
                    ))
                  }
                </select>
              ) : (
                <select
                  value={allocation.cost_code_id}
                  onChange={(e) => updateAllocation(allocation.id, 'cost_code_id', e.target.value)}
                >
                  <option value="">Select Cost Code</option>
                  {costCodes.map((code) => (
                    <option key={code.id} value={code.id}>
                      {code.code} - {code.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="percentage-input">
              <input
                type="number"
                step={inputMode === 'hours' ? '0.1' : '0.01'}
                min="0"
                max={inputMode === 'hours' ? totalHours : 100}
                value={formatDisplayValue(allocation.percentage)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (inputMode === 'hours') {
                    if (value === '' || value === '0') {
                      updateAllocation(allocation.id, 'percentage', '');
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 0 && numValue <= totalHours) {
                        const percentage = convertHoursToPercentage(numValue).toFixed(2);
                        updateAllocation(allocation.id, 'percentage', percentage);
                      }
                    }
                  } else {
                    updateAllocation(allocation.id, 'percentage', value);
                  }
                }}
                onFocus={(e) => {
                  // Select all text when focused to avoid cursor position issues
                  e.target.select();
                }}
                placeholder={inputMode === 'hours' ? '0' : '0.00'}
              />
              <span>{inputMode === 'hours' ? 'hrs' : '%'}</span>
            </div>

            <div className="work-location">
              {(() => {
                if (allocation.job_type === 'mechanic') {
                  return <span className="location-local">Shop</span>;
                }
                
                const selectedJob = jobs.find(j => j.id.toString() === allocation.job_id);
                if (!selectedJob) {
                  return <span className="location-placeholder">Select job first</span>;
                }
                
                if (!selectedJob.is_out_of_state) {
                  return <span className="location-local">Local</span>;
                }
                
                return (
                  <select
                    value={allocation.work_location}
                    onChange={(e) => updateAllocation(allocation.id, 'work_location', e.target.value)}
                    className="location-select"
                  >
                    <option value="onsite">On-site in {selectedJob.job_state}</option>
                    <option value="remote">Remote from {selectedJob.home_state}</option>
                  </select>
                );
              })()}
            </div>

            <div className="actions">
              <button
                className="remove-btn"
                onClick={() => removeAllocationLine(allocation.id)}
                disabled={allocations.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="form-footer">
        <div className="total-percentage">
          <div className="total-display-large">
            Total: <strong>
              {inputMode === 'hours' 
                ? `${getTotalHours().toFixed(1)} / ${totalHours} hrs` 
                : `${totalPercentage.toFixed(2)}%`
              }
            </strong>
          </div>
          {Math.abs(totalPercentage - 100) > 0.01 && (
            <div className="validation-message">
              ▲ Must equal exactly {inputMode === 'hours' ? `${totalHours} hours` : '100.00%'}
            </div>
          )}
          {Math.abs(totalPercentage - 100) <= 0.01 && totalPercentage > 0 && (
            <div className="validation-success">
              ● Total allocation is valid ({inputMode === 'hours' ? `${totalHours} hours` : '100%'})
            </div>
          )}
        </div>
        <div className="action-buttons">
          <button 
            className="save-draft-btn"
            onClick={handleSaveDraft}
            disabled={saving || submitting}
          >
            {saving ? '◗ Saving...' : '◗ Save Draft'}
          </button>
          <button 
            className="submit-btn"
            onClick={handleSubmit}
            disabled={Math.abs(totalPercentage - 100) > 0.01 || submitting || saving}
          >
            {submitting ? '▸ Submitting...' : '▸ Submit Allocation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocationForm;