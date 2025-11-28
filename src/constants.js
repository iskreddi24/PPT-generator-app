// src/constants.js

export const COMPANIES = ['SBA', 'OUTSPACE', 'YUVA'];

// Map specific media types to each company
export const COMPANY_MEDIA_MAP = {
  'SBA': [
    'SBA-Arch', 
    'SBA-Bus Shelter', 
    'SBA-Cantilever', 
    'SBA-Hitech Traffic Umbrella', 
    'SBA-Modern Umbrella', 
    'SBA-Traffic Control Booth', 
    'SBA-Traffic Umbrella'
  ],
  'OUTSPACE': [
    // Add specific types for OUTSPACE here
    'Arch',
    'Back Lit Board',
    'Hoarding',
    'Uni-Pole',
    'Uni-Structure',
    'Bus Shelter'
  ],
  'YUVA': [
    // Add specific types for YUVA here
    'YUVA-LED Screen',
    'YUVA-Kiosk'
  ]
};

// We keep a generic fallback just in case
export const ALL_HOARDING_TYPES = Object.values(COMPANY_MEDIA_MAP).flat();