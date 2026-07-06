-- Seed data for branch_topic_weights
-- Derived from the Phase 0 Core Intelligence Map. Weights are a starting point —
-- tune these once you have real student outcome data.

INSERT INTO branch_topic_weights (branch, topic_name, weight) VALUES
-- CSE
('CSE', 'Calculus', 0.85),
('CSE', 'Algebra', 0.90),
('CSE', 'Probability & Statistics', 0.85),
('CSE', 'Current Electricity & Circuits', 0.30),

-- IT
('IT', 'Algebra', 0.85),
('IT', 'Probability & Statistics', 0.70),
('IT', 'Calculus', 0.60),

-- AI/ML
('AI_ML', 'Algebra', 0.90),
('AI_ML', 'Probability & Statistics', 0.95),
('AI_ML', 'Calculus', 0.80),

-- AI/DS & Data Science
('DATA_SCIENCE', 'Probability & Statistics', 0.95),
('DATA_SCIENCE', 'Algebra', 0.80),
('DATA_SCIENCE', 'Calculus', 0.70),

-- ECE
('ECE', 'Wave Optics (Interference, Diffraction, Polarisation)', 0.85),
('ECE', 'Ray Optics & Optical Instruments', 0.70),
('ECE', 'Semiconductor Devices (Diodes, Transistors)', 0.90),
('ECE', 'Current Electricity & Circuits', 0.85),
('ECE', 'Modern Physics (Atoms, Nuclei)', 0.75),
('ECE', 'Calculus', 0.70),
('ECE', 'Differential Equations', 0.65),
('ECE', 'Trigonometry', 0.60),

-- EEE / Electrical
('EEE', 'Current Electricity & Circuits', 0.90),
('EEE', 'Electromagnetic Induction & AC Circuits', 0.95),
('EEE', 'Differential Equations', 0.75),
('EEE', 'Electrochemistry', 0.55),
('EEE', 'Calculus', 0.65),

-- VLSI
('VLSI', 'Semiconductor Devices (Diodes, Transistors)', 0.95),
('VLSI', 'Current Electricity & Circuits', 0.75),

-- Photonics
('PHOTONICS', 'Wave Optics (Interference, Diffraction, Polarisation)', 0.95),
('PHOTONICS', 'Modern Physics (Atoms, Nuclei)', 0.70),

-- Biomedical
('BIOMEDICAL', 'Ray Optics & Optical Instruments', 0.70),
('BIOMEDICAL', 'Modern Physics (Atoms, Nuclei)', 0.75),

-- Mechanical
('MECH', 'Mechanics (Laws of Motion, Rotational Motion)', 0.90),
('MECH', 'Thermodynamics & Heat Transfer', 0.90),
('MECH', 'Fluid Mechanics (conceptual)', 0.75),
('MECH', 'Coordinate Geometry & Vectors', 0.65),
('MECH', 'Differential Equations', 0.60),
('MECH', 'Polymers & Materials Science', 0.55),
('MECH', 'Thermochemistry', 0.50),

-- Aerospace
('AEROSPACE', 'Mechanics (Laws of Motion, Rotational Motion)', 0.95),
('AEROSPACE', 'Fluid Mechanics (conceptual)', 0.80),
('AEROSPACE', 'Differential Equations', 0.70),

-- Civil
('CIVIL', 'Coordinate Geometry & Vectors', 0.85),
('CIVIL', 'Trigonometry', 0.80),
('CIVIL', 'Fluid Mechanics (conceptual)', 0.75),
('CIVIL', 'Environmental Chemistry', 0.60),
('CIVIL', 'Polymers & Materials Science', 0.55),

-- Environmental Engineering
('ENVIRONMENTAL', 'Environmental Chemistry', 0.95),
('ENVIRONMENTAL', 'Fluid Mechanics (conceptual)', 0.60),

-- Chemical
('CHEMICAL', 'Organic Chemistry (Reactions, Mechanisms)', 0.85),
('CHEMICAL', 'Thermochemistry', 0.85),
('CHEMICAL', 'Electrochemistry', 0.75),
('CHEMICAL', 'Thermodynamics & Heat Transfer', 0.70),

-- Biotech / Pharmacy
('BIOTECH', 'Organic Chemistry (Reactions, Mechanisms)', 0.90),
('PHARMACY', 'Organic Chemistry (Reactions, Mechanisms)', 0.90),

-- Metallurgy
('METALLURGY', 'Polymers & Materials Science', 0.90),
('METALLURGY', 'Thermochemistry', 0.65)

ON CONFLICT (branch, topic_name) DO UPDATE SET weight = EXCLUDED.weight;
