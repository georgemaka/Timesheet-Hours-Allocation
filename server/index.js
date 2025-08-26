const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy data for development
const dummyJobs = [
  { id: 1, erp_job_id: '3012', name: 'Office Building - Downtown', active_flag: true, is_out_of_state: false, home_state: 'CA', job_state: 'CA' },
  { id: 2, erp_job_id: '3025', name: 'Warehouse Complex - North', active_flag: true, is_out_of_state: true, home_state: 'CA', job_state: 'NV' },
  { id: 3, erp_job_id: '3048', name: 'Shopping Center - West', active_flag: true, is_out_of_state: false, home_state: 'CA', job_state: 'CA' },
  { id: 4, erp_job_id: '3052', name: 'Residential Tower - East', active_flag: false, is_out_of_state: true, home_state: 'CA', job_state: 'AZ' },
  { id: 5, erp_job_id: '3067', name: 'Hotel Complex - Las Vegas', active_flag: true, is_out_of_state: true, home_state: 'CA', job_state: 'NV' },
];

const dummyPhases = [
  { id: 1, job_id: 1, code: '100', name: 'Site Preparation', active_flag: true },
  { id: 2, job_id: 1, code: '200', name: 'Foundation', active_flag: true },
  { id: 3, job_id: 1, code: '300', name: 'Structure', active_flag: true },
  { id: 4, job_id: 2, code: '100', name: 'Site Preparation', active_flag: true },
  { id: 5, job_id: 2, code: '200', name: 'Foundation', active_flag: true },
  { id: 6, job_id: 3, code: '100', name: 'Site Preparation', active_flag: true },
  { id: 7, job_id: 3, code: '400', name: 'MEP', active_flag: true },
  { id: 8, job_id: 5, code: '100', name: 'Site Preparation', active_flag: true },
  { id: 9, job_id: 5, code: '500', name: 'Interior Finish', active_flag: true },
];

// Equipment data for mechanic work
const dummyEquipment = [
  // Excavators
  { id: 1, equipment_id: 'CAT320', name: 'Caterpillar 320 Excavator', active_flag: true },
  { id: 2, equipment_id: 'CAT336', name: 'Caterpillar 336 Excavator', active_flag: true },
  { id: 3, equipment_id: 'JD350G', name: 'John Deere 350G LC Excavator', active_flag: true },
  
  // Dozers
  { id: 4, equipment_id: 'JD850K', name: 'John Deere 850K Dozer', active_flag: true },
  { id: 5, equipment_id: 'CAT D6T', name: 'Caterpillar D6T Dozer', active_flag: true },
  { id: 6, equipment_id: 'CASE1650', name: 'Case 1650M Dozer', active_flag: true },
  
  // Loaders
  { id: 7, equipment_id: 'CAT950M', name: 'Caterpillar 950M Loader', active_flag: true },
  { id: 8, equipment_id: 'CAT962M', name: 'Caterpillar 962M Loader', active_flag: true },
  { id: 9, equipment_id: 'JD644K', name: 'John Deere 644K Loader', active_flag: true },
  
  // Dump Trucks
  { id: 10, equipment_id: 'KW900', name: 'Kenworth T900 Dump Truck', active_flag: true },
  { id: 11, equipment_id: 'MACK-GU713', name: 'Mack GU713 Dump Truck', active_flag: true },
  { id: 12, equipment_id: 'PETE-567', name: 'Peterbilt 567 Dump Truck', active_flag: true },
  { id: 13, equipment_id: 'CAT773G', name: 'Caterpillar 773G Off-Highway Truck', active_flag: true },
  
  // Cranes
  { id: 14, equipment_id: 'GROVE75', name: 'Grove RT765E-2 75-Ton Crane', active_flag: true },
  { id: 15, equipment_id: 'LINK90', name: 'Link-Belt RTC-8090 90-Ton Crane', active_flag: true },
  { id: 16, equipment_id: 'TEREX120', name: 'Terex RT120-1 120-Ton Crane', active_flag: true },
  
  // Compactors
  { id: 17, equipment_id: 'CAT815K', name: 'Caterpillar 815K Soil Compactor', active_flag: true },
  { id: 18, equipment_id: 'VOLVO-SD45', name: 'Volvo SD45B Asphalt Compactor', active_flag: true },
  
  // Scrapers
  { id: 19, equipment_id: 'CAT621K', name: 'Caterpillar 621K Scraper', active_flag: true },
  { id: 20, equipment_id: 'JD762B', name: 'John Deere 762B Scraper', active_flag: true },
  
  // Specialty Equipment  
  { id: 21, equipment_id: 'DRILL-D25', name: 'Atlas Copco D25 Drill Rig', active_flag: true },
  { id: 22, equipment_id: 'PILE-H80', name: 'H&P H-80 Pile Driver', active_flag: true },
  { id: 23, equipment_id: 'PUMP-58M', name: 'Putzmeister 58M Concrete Pump', active_flag: true },
  
  // Service Vehicles
  { id: 24, equipment_id: 'SVC-001', name: 'Ford F-550 Service Truck', active_flag: true },
  { id: 25, equipment_id: 'LUBE-001', name: 'Freightliner Lube Truck', active_flag: true },
  { id: 26, equipment_id: 'WELD-001', name: 'Lincoln Welding Truck', active_flag: true },
];

// Cost codes for mechanic work
const dummyCostCodes = [
  // Preventive Maintenance
  { id: 1, code: 'PM-250', name: '250 Hour Service', active_flag: true },
  { id: 2, code: 'PM-500', name: '500 Hour Service', active_flag: true },
  { id: 3, code: 'PM-1000', name: '1000 Hour Service', active_flag: true },
  { id: 4, code: 'PM-2000', name: '2000 Hour Service', active_flag: true },
  { id: 5, code: 'PM-DAILY', name: 'Daily Inspection', active_flag: true },
  { id: 6, code: 'PM-WEEKLY', name: 'Weekly Inspection', active_flag: true },
  
  // Engine & Powertrain
  { id: 7, code: 'ENG-001', name: 'Engine Repair', active_flag: true },
  { id: 8, code: 'ENG-002', name: 'Engine Overhaul', active_flag: true },
  { id: 9, code: 'ENG-003', name: 'Turbo Repair', active_flag: true },
  { id: 10, code: 'TRANS-001', name: 'Transmission Repair', active_flag: true },
  { id: 11, code: 'TRANS-002', name: 'Transmission Service', active_flag: true },
  
  // Hydraulic Systems
  { id: 12, code: 'HYD-001', name: 'Hydraulic System Repair', active_flag: true },
  { id: 13, code: 'HYD-002', name: 'Hydraulic Pump Rebuild', active_flag: true },
  { id: 14, code: 'HYD-003', name: 'Cylinder Repair', active_flag: true },
  { id: 15, code: 'HYD-004', name: 'Hose Replacement', active_flag: true },
  
  // Electrical
  { id: 16, code: 'ELEC-001', name: 'Electrical Troubleshooting', active_flag: true },
  { id: 17, code: 'ELEC-002', name: 'Alternator/Starter Repair', active_flag: true },
  { id: 18, code: 'ELEC-003', name: 'Wiring Harness Repair', active_flag: true },
  
  // Undercarriage & Tracks
  { id: 19, code: 'UC-001', name: 'Track Chain Replacement', active_flag: true },
  { id: 20, code: 'UC-002', name: 'Track Pad Replacement', active_flag: true },
  { id: 21, code: 'UC-003', name: 'Sprocket Replacement', active_flag: true },
  { id: 22, code: 'UC-004', name: 'Idler Wheel Repair', active_flag: true },
  
  // Cooling & Fuel Systems
  { id: 23, code: 'COOL-001', name: 'Radiator Repair', active_flag: true },
  { id: 24, code: 'COOL-002', name: 'Water Pump Replacement', active_flag: true },
  { id: 25, code: 'FUEL-001', name: 'Fuel System Repair', active_flag: true },
  { id: 26, code: 'FUEL-002', name: 'Fuel Filter Replacement', active_flag: true },
  
  // Brakes & Steering
  { id: 27, code: 'BRAKE-001', name: 'Brake System Repair', active_flag: true },
  { id: 28, code: 'BRAKE-002', name: 'Brake Pad Replacement', active_flag: true },
  { id: 29, code: 'STEER-001', name: 'Steering System Repair', active_flag: true },
  
  // Tires & Wheels
  { id: 30, code: 'TIRE-001', name: 'Tire Replacement', active_flag: true },
  { id: 31, code: 'TIRE-002', name: 'Tire Repair', active_flag: true },
  { id: 32, code: 'WHEEL-001', name: 'Wheel Bearing Replacement', active_flag: true },
  
  // Emergency & Breakdown
  { id: 33, code: 'EMRG-001', name: 'Emergency Field Repair', active_flag: true },
  { id: 34, code: 'EMRG-002', name: 'Tow/Recovery Service', active_flag: true },
  { id: 35, code: 'BREAK-001', name: 'Breakdown Diagnosis', active_flag: true },
  
  // Welding & Fabrication
  { id: 36, code: 'WELD-001', name: 'Structural Welding', active_flag: true },
  { id: 37, code: 'WELD-002', name: 'Crack Repair', active_flag: true },
  { id: 38, code: 'FAB-001', name: 'Custom Fabrication', active_flag: true },
  
  // Shop Operations
  { id: 39, code: 'SHOP-001', name: 'Shop Overhead', active_flag: true },
  { id: 40, code: 'SHOP-002', name: 'Tool Maintenance', active_flag: true },
  { id: 41, code: 'SHOP-003', name: 'Equipment Setup', active_flag: true },
  
  // Documentation & Training
  { id: 42, code: 'DOC-001', name: 'Work Order Documentation', active_flag: true },
  { id: 43, code: 'TRAIN-001', name: 'Safety Training', active_flag: true },
  { id: 44, code: 'TRAIN-002', name: 'Technical Training', active_flag: true },
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
    { id: '1', job_id: '1', phase_id: '2', percentage: '60', work_location: '' },
    { id: '2', job_id: '2', phase_id: '4', percentage: '40', work_location: 'onsite' }
  ];
  
  res.json({
    week_id: 0, // Previous week
    allocations: previousAllocation,
    message: 'Previous week allocation loaded'
  });
});

// Equipment routes for mechanic work
app.get('/api/equipment', (req, res) => {
  const activeEquipment = dummyEquipment.filter(equipment => equipment.active_flag);
  res.json(activeEquipment);
});

// Cost codes routes for mechanic work
app.get('/api/cost-codes', (req, res) => {
  const activeCostCodes = dummyCostCodes.filter(code => code.active_flag);
  res.json(activeCostCodes);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});