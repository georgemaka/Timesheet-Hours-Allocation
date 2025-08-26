const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy data for development
const dummyJobs = [
  { id: 1, erp_job_id: '3012', name: 'Office Building - Downtown', active_flag: true },
  { id: 2, erp_job_id: '3025', name: 'Warehouse Complex - North', active_flag: true },
  { id: 3, erp_job_id: '3048', name: 'Shopping Center - West', active_flag: true },
  { id: 4, erp_job_id: '3052', name: 'Residential Tower - East', active_flag: false },
];

const dummyPhases = [
  { id: 1, job_id: 1, code: '100', name: 'Site Preparation', active_flag: true },
  { id: 2, job_id: 1, code: '200', name: 'Foundation', active_flag: true },
  { id: 3, job_id: 1, code: '300', name: 'Structure', active_flag: true },
  { id: 4, job_id: 2, code: '100', name: 'Site Preparation', active_flag: true },
  { id: 5, job_id: 2, code: '200', name: 'Foundation', active_flag: true },
  { id: 6, job_id: 3, code: '100', name: 'Site Preparation', active_flag: true },
  { id: 7, job_id: 3, code: '400', name: 'MEP', active_flag: true },
];

// Routes
app.get('/api/jobs', (req, res) => {
  const activeJobs = dummyJobs.filter(job => job.active_flag);
  res.json(activeJobs);
});

app.get('/api/phases/:jobId', (req, res) => {
  const jobId = parseInt(req.params.jobId);
  const phases = dummyPhases.filter(phase => phase.job_id === jobId && phase.active_flag);
  res.json(phases);
});

app.get('/api/current-week', (req, res) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  res.json({
    id: 1,
    start_date: startOfWeek.toISOString().split('T')[0],
    end_date: endOfWeek.toISOString().split('T')[0],
    status: 'open'
  });
});

app.post('/api/allocations', (req, res) => {
  const { week_id, allocations, status } = req.body;
  
  // Simulate processing time for better UX demo
  setTimeout(() => {
    console.log(`=== ${status.toUpperCase()} ALLOCATION ===`);
    console.log('Week ID:', week_id);
    console.log('Employee: George Makakaufaki');
    console.log('Status:', status);
    console.log('Allocations:');
    
    allocations.forEach((allocation, index) => {
      if (allocation.is_pto) {
        console.log(`  ${index + 1}. PTO: ${allocation.percentage}%`);
      } else if (allocation.job_id && allocation.phase_id) {
        const job = dummyJobs.find(j => j.id == allocation.job_id);
        const phase = dummyPhases.find(p => p.id == allocation.phase_id);
        console.log(`  ${index + 1}. Job ${job?.erp_job_id} - ${job?.name}`);
        console.log(`     Phase ${phase?.code} - ${phase?.name}: ${allocation.percentage}%`);
      }
    });
    
    console.log('=====================================\n');
    
    const responseMessage = status === 'draft' 
      ? 'Draft saved successfully. You can continue editing until submission.'
      : 'Time allocation submitted successfully! Manager notification sent.';
    
    res.json({ 
      success: true, 
      message: responseMessage,
      timestamp: new Date().toISOString(),
      status: status
    });
  }, 1000); // 1 second delay to show loading states
});

// Mock previous week allocation data
app.get('/api/previous-allocation', (req, res) => {
  // Simulate previous week's allocation
  const previousAllocation = [
    { id: '1', job_id: '1', phase_id: '2', percentage: '60', is_pto: false },
    { id: '2', job_id: '2', phase_id: '4', percentage: '40', is_pto: false }
  ];
  
  res.json({
    week_id: 0, // Previous week
    allocations: previousAllocation,
    message: 'Previous week allocation loaded'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});