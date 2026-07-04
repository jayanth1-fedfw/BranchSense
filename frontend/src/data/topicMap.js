// Mirrors backend/db/seed_weights.sql topic names exactly — keep these in sync.
// max marks are placeholders; adjust per board (CBSE vs state boards differ).

export const SUBJECTS_BY_STREAM = {
  MPC: ['MATHEMATICS', 'PHYSICS', 'CHEMISTRY'],
  BiPC: ['BIOLOGY', 'PHYSICS', 'CHEMISTRY'],
};

export const TOPICS_BY_SUBJECT = {
  MATHEMATICS: [
    { topic: 'Calculus', max: 20 },
    { topic: 'Algebra', max: 15 },
    { topic: 'Coordinate Geometry & Vectors', max: 12 },
    { topic: 'Probability & Statistics', max: 10 },
    { topic: 'Differential Equations', max: 10 },
    { topic: 'Trigonometry', max: 8 },
  ],
  PHYSICS: [
    { topic: 'Wave Optics (Interference, Diffraction, Polarisation)', max: 8 },
    { topic: 'Ray Optics & Optical Instruments', max: 5 },
    { topic: 'Current Electricity & Circuits', max: 10 },
    { topic: 'Electromagnetic Induction & AC Circuits', max: 8 },
    { topic: 'Semiconductor Devices (Diodes, Transistors)', max: 6 },
    { topic: 'Mechanics (Laws of Motion, Rotational Motion)', max: 10 },
    { topic: 'Thermodynamics & Heat Transfer', max: 8 },
    { topic: 'Fluid Mechanics (conceptual)', max: 5 },
    { topic: 'Modern Physics (Atoms, Nuclei)', max: 6 },
  ],
  CHEMISTRY: [
    { topic: 'Organic Chemistry (Reactions, Mechanisms)', max: 15 },
    { topic: 'Electrochemistry', max: 8 },
    { topic: 'Polymers & Materials Science', max: 6 },
    { topic: 'Environmental Chemistry', max: 5 },
    { topic: 'Thermochemistry', max: 8 },
  ],
  BIOLOGY: [
    { topic: 'Genetics & Evolution', max: 15 },
    { topic: 'Human Physiology', max: 15 },
    { topic: 'Ecology & Environment', max: 10 },
  ],
};