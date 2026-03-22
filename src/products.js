/**
 * Oil and related product definitions with metadata.
 */
const OIL_PRODUCTS = [
  {
    id: 'crude_wti',
    name: 'WTI Crude Oil',
    category: 'Crude Oil',
    unit: '$/barrel',
    description: 'West Texas Intermediate crude oil benchmark'
  },
  {
    id: 'crude_brent',
    name: 'Brent Crude Oil',
    category: 'Crude Oil',
    unit: '$/barrel',
    description: 'Brent crude oil international benchmark'
  },
  {
    id: 'gasoline_rbob',
    name: 'RBOB Gasoline',
    category: 'Refined Products',
    unit: '$/gallon',
    description: 'Reformulated Blendstock for Oxygenate Blending'
  },
  {
    id: 'diesel_ulsd',
    name: 'Ultra-Low Sulfur Diesel',
    category: 'Refined Products',
    unit: '$/gallon',
    description: 'ULSD heating oil / diesel fuel'
  },
  {
    id: 'heating_oil',
    name: 'Heating Oil',
    category: 'Refined Products',
    unit: '$/gallon',
    description: 'No. 2 heating oil'
  },
  {
    id: 'jet_fuel',
    name: 'Jet Fuel (Kerosene)',
    category: 'Refined Products',
    unit: '$/gallon',
    description: 'Aviation turbine fuel'
  },
  {
    id: 'natural_gas',
    name: 'Natural Gas',
    category: 'Natural Gas',
    unit: '$/MMBtu',
    description: 'Henry Hub natural gas'
  },
  {
    id: 'propane',
    name: 'Propane',
    category: 'NGLs',
    unit: '$/gallon',
    description: 'Mont Belvieu propane'
  },
  {
    id: 'naphtha',
    name: 'Naphtha',
    category: 'Petrochemicals',
    unit: '$/ton',
    description: 'Light naphtha feedstock'
  },
  {
    id: 'fuel_oil',
    name: 'Fuel Oil (380 CST)',
    category: 'Bunker Fuel',
    unit: '$/ton',
    description: 'Marine bunker fuel oil'
  },
  {
    id: 'lpg',
    name: 'LPG',
    category: 'NGLs',
    unit: '$/ton',
    description: 'Liquefied petroleum gas'
  },
  {
    id: 'bitumen',
    name: 'Bitumen',
    category: 'Heavy Products',
    unit: '$/ton',
    description: 'Asphalt grade bitumen'
  }
];

const CATEGORIES = [...new Set(OIL_PRODUCTS.map(p => p.category))];

module.exports = { OIL_PRODUCTS, CATEGORIES };
