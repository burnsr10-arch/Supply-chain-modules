/**
 * Related stocks and ETFs for each oil product category.
 * Top 10 per product — a mix of stocks (producers, refiners, servicers)
 * and ETFs that give direct or indirect exposure.
 */
const RELATED_SECURITIES = {
  crude_wti: {
    label: 'WTI Crude Oil',
    securities: [
      { ticker: 'XOM',  name: 'Exxon Mobil',              type: 'Stock',  exposure: 'Integrated major, largest US oil producer' },
      { ticker: 'CVX',  name: 'Chevron',                  type: 'Stock',  exposure: 'Integrated major, heavy Permian Basin presence' },
      { ticker: 'COP',  name: 'ConocoPhillips',           type: 'Stock',  exposure: 'Pure-play E&P, largest independent US producer' },
      { ticker: 'EOG',  name: 'EOG Resources',            type: 'Stock',  exposure: 'Premium shale driller, Eagle Ford & Permian' },
      { ticker: 'PXD',  name: 'Pioneer Natural Resources', type: 'Stock', exposure: 'Top Permian Basin pure-play producer' },
      { ticker: 'OXY',  name: 'Occidental Petroleum',     type: 'Stock',  exposure: 'Permian E&P with carbon capture initiatives' },
      { ticker: 'USO',  name: 'United States Oil Fund',   type: 'ETF',   exposure: 'Tracks WTI front-month futures directly' },
      { ticker: 'BNO',  name: 'US Brent Oil Fund',        type: 'ETF',   exposure: 'Brent crude futures exposure' },
      { ticker: 'DBO',  name: 'Invesco DB Oil Fund',      type: 'ETF',   exposure: 'Optimized roll yield crude oil ETF' },
      { ticker: 'XLE',  name: 'Energy Select Sector SPDR', type: 'ETF',  exposure: 'Broad S&P 500 energy sector basket' }
    ]
  },
  crude_brent: {
    label: 'Brent Crude Oil',
    securities: [
      { ticker: 'SHEL', name: 'Shell plc',                type: 'Stock',  exposure: 'Global integrated major, North Sea heritage' },
      { ticker: 'BP',   name: 'BP plc',                   type: 'Stock',  exposure: 'UK-based integrated, global upstream/downstream' },
      { ticker: 'TTE',  name: 'TotalEnergies',            type: 'Stock',  exposure: 'French integrated major, diversified global assets' },
      { ticker: 'EQNR', name: 'Equinor ASA',              type: 'Stock',  exposure: 'Norwegian state-backed, North Sea dominant' },
      { ticker: 'ENI',  name: 'Eni S.p.A.',               type: 'Stock',  exposure: 'Italian integrated, Africa & Mediterranean focus' },
      { ticker: 'CNQ',  name: 'Canadian Natural Resources', type: 'Stock', exposure: 'Canadas largest oil producer, oil sands' },
      { ticker: 'BNO',  name: 'US Brent Oil Fund',        type: 'ETF',   exposure: 'Tracks Brent crude futures directly' },
      { ticker: 'IEO',  name: 'iShares US Oil & Gas E&P', type: 'ETF',   exposure: 'US exploration & production companies' },
      { ticker: 'XOP',  name: 'SPDR S&P Oil & Gas E&P',   type: 'ETF',  exposure: 'Equal-weight E&P companies' },
      { ticker: 'FILL', name: 'iShares MSCI Global Energy', type: 'ETF', exposure: 'Global energy equities across markets' }
    ]
  },
  gasoline_rbob: {
    label: 'RBOB Gasoline',
    securities: [
      { ticker: 'MPC',  name: 'Marathon Petroleum',       type: 'Stock',  exposure: 'Largest US refiner by capacity' },
      { ticker: 'VLO',  name: 'Valero Energy',            type: 'Stock',  exposure: 'Major independent refiner, gasoline focused' },
      { ticker: 'PSX',  name: 'Phillips 66',              type: 'Stock',  exposure: 'Refining, midstream, and chemicals' },
      { ticker: 'HFC',  name: 'HF Sinclair',              type: 'Stock',  exposure: 'Independent refiner, Rocky Mountain region' },
      { ticker: 'DK',   name: 'Delek US Holdings',        type: 'Stock',  exposure: 'Regional refiner, US mid-continent' },
      { ticker: 'PBF',  name: 'PBF Energy',               type: 'Stock',  exposure: 'East Coast & mid-continent refiner' },
      { ticker: 'CASY', name: 'Caseys General Stores',    type: 'Stock',  exposure: 'Fuel retail, gasoline margins proxy' },
      { ticker: 'UGA',  name: 'United States Gasoline Fund', type: 'ETF', exposure: 'Tracks RBOB gasoline futures directly' },
      { ticker: 'CRAK', name: 'VanEck Oil Refiners ETF',  type: 'ETF',   exposure: 'Global refining companies basket' },
      { ticker: 'XLE',  name: 'Energy Select Sector SPDR', type: 'ETF',  exposure: 'Broad energy sector with refiner weight' }
    ]
  },
  diesel_ulsd: {
    label: 'Ultra-Low Sulfur Diesel',
    securities: [
      { ticker: 'VLO',  name: 'Valero Energy',            type: 'Stock',  exposure: 'Largest diesel refiner in US' },
      { ticker: 'MPC',  name: 'Marathon Petroleum',       type: 'Stock',  exposure: 'Major distillate producer' },
      { ticker: 'PSX',  name: 'Phillips 66',              type: 'Stock',  exposure: 'Significant diesel/distillate output' },
      { ticker: 'HFC',  name: 'HF Sinclair',              type: 'Stock',  exposure: 'Diesel-heavy refiner mix' },
      { ticker: 'PBF',  name: 'PBF Energy',               type: 'Stock',  exposure: 'East Coast diesel supply refiner' },
      { ticker: 'PAA',  name: 'Plains All American',      type: 'Stock',  exposure: 'Crude/refined product pipelines' },
      { ticker: 'CVRR', name: 'CVR Partners',             type: 'Stock',  exposure: 'Nitrogen fertilizer from petroleum coke' },
      { ticker: 'CRAK', name: 'VanEck Oil Refiners ETF',  type: 'ETF',   exposure: 'Refining crack spread exposure' },
      { ticker: 'UGA',  name: 'United States Gasoline Fund', type: 'ETF', exposure: 'Refined products price proxy' },
      { ticker: 'IEO',  name: 'iShares US Oil & Gas E&P', type: 'ETF',   exposure: 'Upstream/midstream exposure' }
    ]
  },
  heating_oil: {
    label: 'Heating Oil',
    securities: [
      { ticker: 'VLO',  name: 'Valero Energy',            type: 'Stock',  exposure: 'Top distillate refiner' },
      { ticker: 'MPC',  name: 'Marathon Petroleum',       type: 'Stock',  exposure: 'Major heating oil season supplier' },
      { ticker: 'PSX',  name: 'Phillips 66',              type: 'Stock',  exposure: 'Northeast heating oil supplier' },
      { ticker: 'SUN',  name: 'Sunoco LP',                type: 'Stock',  exposure: 'Fuel distribution including heating oil' },
      { ticker: 'SPH',  name: 'Suburban Propane Partners', type: 'Stock',  exposure: 'Heating fuel distributor' },
      { ticker: 'PARR', name: 'Par Pacific Holdings',     type: 'Stock',  exposure: 'Regional refiner with distillate focus' },
      { ticker: 'PBF',  name: 'PBF Energy',               type: 'Stock',  exposure: 'Northeast refining operations' },
      { ticker: 'CRAK', name: 'VanEck Oil Refiners ETF',  type: 'ETF',   exposure: 'Refiner equities basket' },
      { ticker: 'XLE',  name: 'Energy Select Sector SPDR', type: 'ETF',  exposure: 'Broad energy sector' },
      { ticker: 'VDE',  name: 'Vanguard Energy ETF',      type: 'ETF',   exposure: 'Low-cost broad energy exposure' }
    ]
  },
  jet_fuel: {
    label: 'Jet Fuel (Kerosene)',
    securities: [
      { ticker: 'MPC',  name: 'Marathon Petroleum',       type: 'Stock',  exposure: 'Major jet fuel refiner for US airlines' },
      { ticker: 'VLO',  name: 'Valero Energy',            type: 'Stock',  exposure: 'Significant jet/kerosene output' },
      { ticker: 'PSX',  name: 'Phillips 66',              type: 'Stock',  exposure: 'Aviation fuel producer' },
      { ticker: 'DAL',  name: 'Delta Air Lines',          type: 'Stock',  exposure: 'Airline with own refinery (Trainer, PA)' },
      { ticker: 'AAL',  name: 'American Airlines',        type: 'Stock',  exposure: 'Largest airline, inverse jet fuel exposure' },
      { ticker: 'UAL',  name: 'United Airlines',          type: 'Stock',  exposure: 'Major airline, fuel cost sensitivity' },
      { ticker: 'LUV',  name: 'Southwest Airlines',       type: 'Stock',  exposure: 'Known for fuel hedging strategies' },
      { ticker: 'JETS', name: 'US Global Jets ETF',       type: 'ETF',   exposure: 'Airline sector basket, inverse fuel proxy' },
      { ticker: 'CRAK', name: 'VanEck Oil Refiners ETF',  type: 'ETF',   exposure: 'Jet fuel refining margin exposure' },
      { ticker: 'IYT',  name: 'iShares Transportation Avg', type: 'ETF', exposure: 'Transport sector fuel cost sensitivity' }
    ]
  },
  natural_gas: {
    label: 'Natural Gas',
    securities: [
      { ticker: 'EQT',  name: 'EQT Corporation',          type: 'Stock',  exposure: 'Largest US natural gas producer' },
      { ticker: 'SWN',  name: 'Southwestern Energy',      type: 'Stock',  exposure: 'Appalachian Basin gas producer' },
      { ticker: 'AR',   name: 'Antero Resources',         type: 'Stock',  exposure: 'Appalachian gas & NGL producer' },
      { ticker: 'RRC',  name: 'Range Resources',          type: 'Stock',  exposure: 'Marcellus Shale gas pure-play' },
      { ticker: 'CHK',  name: 'Chesapeake Energy',        type: 'Stock',  exposure: 'Haynesville & Marcellus gas producer' },
      { ticker: 'LNG',  name: 'Cheniere Energy',          type: 'Stock',  exposure: 'Largest US LNG exporter' },
      { ticker: 'KMI',  name: 'Kinder Morgan',            type: 'Stock',  exposure: 'Largest US gas pipeline operator' },
      { ticker: 'UNG',  name: 'United States Nat Gas Fund', type: 'ETF', exposure: 'Tracks Henry Hub gas futures directly' },
      { ticker: 'BOIL', name: 'ProShares Ultra Bloomberg NG', type: 'ETF', exposure: '2x leveraged natural gas futures' },
      { ticker: 'FCG',  name: 'First Trust Nat Gas ETF',  type: 'ETF',   exposure: 'Natural gas equity producers basket' }
    ]
  },
  propane: {
    label: 'Propane',
    securities: [
      { ticker: 'TRGP', name: 'Targa Resources',          type: 'Stock',  exposure: 'NGL gathering, processing & fractionation' },
      { ticker: 'WMB',  name: 'Williams Companies',       type: 'Stock',  exposure: 'Gas processing with NGL extraction' },
      { ticker: 'OKE',  name: 'ONEOK',                    type: 'Stock',  exposure: 'NGL pipelines and fractionation' },
      { ticker: 'AM',   name: 'Antero Midstream',         type: 'Stock',  exposure: 'NGL gathering and processing' },
      { ticker: 'SPH',  name: 'Suburban Propane Partners', type: 'Stock',  exposure: 'Largest US propane distributor' },
      { ticker: 'SHLX', name: 'Shell Midstream Partners', type: 'Stock',  exposure: 'NGL pipeline operations' },
      { ticker: 'AR',   name: 'Antero Resources',         type: 'Stock',  exposure: 'Major NGL/propane producer' },
      { ticker: 'AMLP', name: 'Alerian MLP ETF',          type: 'ETF',   exposure: 'Midstream MLP basket, NGL exposure' },
      { ticker: 'MLPA', name: 'Global X MLP ETF',         type: 'ETF',   exposure: 'MLP equities with NGL transport' },
      { ticker: 'XLE',  name: 'Energy Select Sector SPDR', type: 'ETF',  exposure: 'Broad energy with midstream weight' }
    ]
  },
  naphtha: {
    label: 'Naphtha',
    securities: [
      { ticker: 'LYB',  name: 'LyondellBasell',           type: 'Stock',  exposure: 'Global petrochemicals, naphtha cracker operator' },
      { ticker: 'DOW',  name: 'Dow Inc',                  type: 'Stock',  exposure: 'Chemicals giant, naphtha feedstock user' },
      { ticker: 'CE',   name: 'Celanese Corp',            type: 'Stock',  exposure: 'Specialty chemicals from petroleum derivatives' },
      { ticker: 'EMN',  name: 'Eastman Chemical',         type: 'Stock',  exposure: 'Chemicals producer, naphtha-based products' },
      { ticker: 'SHEL', name: 'Shell plc',                type: 'Stock',  exposure: 'Major naphtha trader and cracker operator' },
      { ticker: 'TSE',  name: 'Trinseo',                  type: 'Stock',  exposure: 'Plastics & latex from petroleum feedstock' },
      { ticker: 'BASFY', name: 'BASF SE',                 type: 'Stock',  exposure: 'Worlds largest chemical company, Verbund' },
      { ticker: 'XLB',  name: 'Materials Select Sector SPDR', type: 'ETF', exposure: 'Materials sector including chemicals' },
      { ticker: 'VAW',  name: 'Vanguard Materials ETF',   type: 'ETF',   exposure: 'Broad materials with chemical producers' },
      { ticker: 'IYM',  name: 'iShares US Basic Materials', type: 'ETF', exposure: 'US chemicals and materials basket' }
    ]
  },
  fuel_oil: {
    label: 'Fuel Oil (380 CST)',
    securities: [
      { ticker: 'STNG', name: 'Scorpio Tankers',          type: 'Stock',  exposure: 'Product tanker fleet, bunker fuel consumer' },
      { ticker: 'FRO',  name: 'Frontline plc',            type: 'Stock',  exposure: 'VLCC tanker operator, major fuel oil buyer' },
      { ticker: 'INSW', name: 'International Seaways',    type: 'Stock',  exposure: 'Crude tanker fleet, bunker cost exposure' },
      { ticker: 'TNK',  name: 'Teekay Tankers',           type: 'Stock',  exposure: 'Mid-size tanker fleet' },
      { ticker: 'TRMD', name: 'TORM plc',                 type: 'Stock',  exposure: 'Product tanker, fuel oil shipping' },
      { ticker: 'ZIM',  name: 'ZIM Integrated Shipping',  type: 'Stock',  exposure: 'Container shipping, large bunker spend' },
      { ticker: 'DAC',  name: 'Danaos Corp',              type: 'Stock',  exposure: 'Containership lessor, fuel cost pass-through' },
      { ticker: 'BDRY', name: 'Breakwave Dry Bulk Ship ETF', type: 'ETF', exposure: 'Dry bulk freight rates, fuel cost proxy' },
      { ticker: 'BOAT', name: 'SonicShares Intl Shipping', type: 'ETF', exposure: 'Global shipping companies basket' },
      { ticker: 'SEA',  name: 'US Global Sea to Sky ETF',  type: 'ETF',  exposure: 'Cargo shipping & logistics' }
    ]
  },
  lpg: {
    label: 'LPG',
    securities: [
      { ticker: 'TRGP', name: 'Targa Resources',          type: 'Stock',  exposure: 'NGL processing and fractionation' },
      { ticker: 'OKE',  name: 'ONEOK',                    type: 'Stock',  exposure: 'NGL pipelines, LPG transport' },
      { ticker: 'WMB',  name: 'Williams Companies',       type: 'Stock',  exposure: 'Gas processing with LPG extraction' },
      { ticker: 'EPD',  name: 'Enterprise Products',      type: 'Stock',  exposure: 'Largest US NGL pipeline & export terminal' },
      { ticker: 'ET',   name: 'Energy Transfer',          type: 'Stock',  exposure: 'Diversified midstream, NGL/LPG transport' },
      { ticker: 'MPLX', name: 'MPLX LP',                  type: 'Stock',  exposure: 'Gathering, processing & fractionation' },
      { ticker: 'LNG',  name: 'Cheniere Energy',          type: 'Stock',  exposure: 'LNG export with LPG co-products' },
      { ticker: 'AMLP', name: 'Alerian MLP ETF',          type: 'ETF',   exposure: 'Midstream MLPs with NGL exposure' },
      { ticker: 'EMLP', name: 'First Trust NA Energy Infra', type: 'ETF', exposure: 'Energy infrastructure with LPG transport' },
      { ticker: 'XLE',  name: 'Energy Select Sector SPDR', type: 'ETF',  exposure: 'Broad energy with midstream weight' }
    ]
  },
  bitumen: {
    label: 'Bitumen',
    securities: [
      { ticker: 'SU',   name: 'Suncor Energy',            type: 'Stock',  exposure: 'Canadas largest oil sands / bitumen producer' },
      { ticker: 'CVE',  name: 'Cenovus Energy',           type: 'Stock',  exposure: 'Oil sands producer, heavy oil upgrader' },
      { ticker: 'IMO',  name: 'Imperial Oil',             type: 'Stock',  exposure: 'Oil sands & bitumen upgrading (Exxon subsidiary)' },
      { ticker: 'CNQ',  name: 'Canadian Natural Resources', type: 'Stock', exposure: 'Horizon & Jackpine oil sands operations' },
      { ticker: 'MEG',  name: 'MEG Energy',               type: 'Stock',  exposure: 'Christina Lake SAGD bitumen producer' },
      { ticker: 'ATH',  name: 'Athabasca Oil Corp',       type: 'Stock',  exposure: 'Thermal oil sands producer' },
      { ticker: 'SJR.B', name: 'Shaw Industries',         type: 'Stock',  exposure: 'Asphalt & paving materials' },
      { ticker: 'VMC',  name: 'Vulcan Materials',         type: 'Stock',  exposure: 'Road construction materials, asphalt buyer' },
      { ticker: 'XEG',  name: 'iShares S&P/TSX Capped Energy', type: 'ETF', exposure: 'Canadian energy equities with oil sands' },
      { ticker: 'FENY', name: 'Fidelity MSCI Energy ETF', type: 'ETF',   exposure: 'Low-cost broad energy exposure' }
    ]
  }
};

module.exports = { RELATED_SECURITIES };
