import React, { useState, useEffect, useMemo, useRef } from 'react';

// ---------------------------------------------------------------------------
// Oil & Energy KPI Tracker — Claude Code Artifact
// Self-contained React component migrated from the Express + static HTML app.
// All product, KPI, 30-day sparkline, and related-securities data are inlined
// from /data at reference date 2026-03-20, so the dashboard renders
// instantly with no network fetches.
// ---------------------------------------------------------------------------

const REFERENCE_DATE = "2026-03-20";

const PRODUCTS = [{"id":"crude_wti","name":"WTI Crude Oil","category":"Crude Oil","unit":"$/barrel","description":"West Texas Intermediate crude oil benchmark"},{"id":"crude_brent","name":"Brent Crude Oil","category":"Crude Oil","unit":"$/barrel","description":"Brent crude oil international benchmark"},{"id":"gasoline_rbob","name":"RBOB Gasoline","category":"Refined Products","unit":"$/gallon","description":"Reformulated Blendstock for Oxygenate Blending"},{"id":"diesel_ulsd","name":"Ultra-Low Sulfur Diesel","category":"Refined Products","unit":"$/gallon","description":"ULSD heating oil / diesel fuel"},{"id":"heating_oil","name":"Heating Oil","category":"Refined Products","unit":"$/gallon","description":"No. 2 heating oil"},{"id":"jet_fuel","name":"Jet Fuel (Kerosene)","category":"Refined Products","unit":"$/gallon","description":"Aviation turbine fuel"},{"id":"natural_gas","name":"Natural Gas","category":"Natural Gas","unit":"$/MMBtu","description":"Henry Hub natural gas"},{"id":"propane","name":"Propane","category":"NGLs","unit":"$/gallon","description":"Mont Belvieu propane"},{"id":"naphtha","name":"Naphtha","category":"Petrochemicals","unit":"$/ton","description":"Light naphtha feedstock"},{"id":"fuel_oil","name":"Fuel Oil (380 CST)","category":"Bunker Fuel","unit":"$/ton","description":"Marine bunker fuel oil"},{"id":"lpg","name":"LPG","category":"NGLs","unit":"$/ton","description":"Liquefied petroleum gas"},{"id":"bitumen","name":"Bitumen","category":"Heavy Products","unit":"$/ton","description":"Asphalt grade bitumen"}];

const KPIS = {"crude_wti":{"currentPrice":69.19,"currentDate":"2026-03-20","wow":{"previousPrice":68.36,"previousDate":"2026-03-13","pctChange":1.2141603276770017},"mtd":{"previousPrice":67.81,"previousDate":"2026-02-27","pctChange":2.0350980681315374},"ytd":{"previousPrice":74.55,"previousDate":"2026-01-01","pctChange":-7.189805499664654}},"crude_brent":{"currentPrice":83.21,"currentDate":"2026-03-20","wow":{"previousPrice":84.58,"previousDate":"2026-03-13","pctChange":-1.6197682667297288},"mtd":{"previousPrice":84.42,"previousDate":"2026-02-27","pctChange":-1.4333096422648754},"ytd":{"previousPrice":81.22,"previousDate":"2026-01-01","pctChange":2.450135434622008}},"gasoline_rbob":{"currentPrice":2.33,"currentDate":"2026-03-20","wow":{"previousPrice":2.24,"previousDate":"2026-03-13","pctChange":4.017857142857136},"mtd":{"previousPrice":2.16,"previousDate":"2026-02-27","pctChange":7.870370370370367},"ytd":{"previousPrice":2.31,"previousDate":"2026-01-01","pctChange":0.8658008658008665}},"diesel_ulsd":{"currentPrice":2.63,"currentDate":"2026-03-20","wow":{"previousPrice":2.68,"previousDate":"2026-03-13","pctChange":-1.8656716417910546},"mtd":{"previousPrice":2.68,"previousDate":"2026-02-27","pctChange":-1.8656716417910546},"ytd":{"previousPrice":2.58,"previousDate":"2026-01-01","pctChange":1.937984496124024}},"heating_oil":{"currentPrice":2.73,"currentDate":"2026-03-20","wow":{"previousPrice":2.66,"previousDate":"2026-03-13","pctChange":2.631578947368415},"mtd":{"previousPrice":2.47,"previousDate":"2026-02-27","pctChange":10.526315789473676},"ytd":{"previousPrice":2.53,"previousDate":"2026-01-01","pctChange":7.905138339920955}},"jet_fuel":{"currentPrice":2.53,"currentDate":"2026-03-20","wow":{"previousPrice":2.56,"previousDate":"2026-03-13","pctChange":-1.1718750000000098},"mtd":{"previousPrice":2.68,"previousDate":"2026-02-27","pctChange":-5.597014925373147},"ytd":{"previousPrice":2.75,"previousDate":"2026-01-01","pctChange":-8.000000000000007}},"natural_gas":{"currentPrice":2.94,"currentDate":"2026-03-20","wow":{"previousPrice":3.07,"previousDate":"2026-03-13","pctChange":-4.234527687296414},"mtd":{"previousPrice":3.19,"previousDate":"2026-02-27","pctChange":-7.836990595611286},"ytd":{"previousPrice":3.45,"previousDate":"2026-01-01","pctChange":-14.782608695652181}},"propane":{"currentPrice":0.88,"currentDate":"2026-03-20","wow":{"previousPrice":0.84,"previousDate":"2026-03-13","pctChange":4.761904761904766},"mtd":{"previousPrice":0.8,"previousDate":"2026-02-27","pctChange":9.999999999999995},"ytd":{"previousPrice":0.98,"previousDate":"2026-01-01","pctChange":-10.20408163265306}},"naphtha":{"currentPrice":619.25,"currentDate":"2026-03-20","wow":{"previousPrice":625.15,"previousDate":"2026-03-13","pctChange":-0.9437734943613496},"mtd":{"previousPrice":589.62,"previousDate":"2026-02-27","pctChange":5.025270513211899},"ytd":{"previousPrice":603.82,"previousDate":"2026-01-01","pctChange":2.555397303832259}},"fuel_oil":{"currentPrice":399.67,"currentDate":"2026-03-20","wow":{"previousPrice":396.16,"previousDate":"2026-03-13","pctChange":0.8860056542810962},"mtd":{"previousPrice":390.96,"previousDate":"2026-02-27","pctChange":2.227849396357693},"ytd":{"previousPrice":407.72,"previousDate":"2026-01-01","pctChange":-1.9743941920926151}},"lpg":{"currentPrice":534.93,"currentDate":"2026-03-20","wow":{"previousPrice":523.92,"previousDate":"2026-03-13","pctChange":2.101465872652312},"mtd":{"previousPrice":532.23,"previousDate":"2026-02-27","pctChange":0.5072994757905289},"ytd":{"previousPrice":543.3,"previousDate":"2026-01-01","pctChange":-1.5405853119823312}},"bitumen":{"currentPrice":392.74,"currentDate":"2026-03-20","wow":{"previousPrice":385.4,"previousDate":"2026-03-13","pctChange":1.9045147898287578},"mtd":{"previousPrice":390.93,"previousDate":"2026-02-27","pctChange":0.4629984907784008},"ytd":{"previousPrice":375.63,"previousDate":"2026-01-01","pctChange":4.555014242738869}}};

const PRICE_HISTORY_30D = {"crude_wti":[{"date":"2026-02-09","price":68.54},{"date":"2026-02-10","price":69.78},{"date":"2026-02-11","price":67.92},{"date":"2026-02-12","price":68.39},{"date":"2026-02-13","price":67.12},{"date":"2026-02-16","price":67.23},{"date":"2026-02-17","price":66.57},{"date":"2026-02-18","price":65.89},{"date":"2026-02-19","price":66.7},{"date":"2026-02-20","price":66.71},{"date":"2026-02-23","price":67.3},{"date":"2026-02-24","price":68.4},{"date":"2026-02-25","price":68.72},{"date":"2026-02-26","price":68.6},{"date":"2026-02-27","price":67.81},{"date":"2026-03-02","price":67.3},{"date":"2026-03-03","price":67.47},{"date":"2026-03-04","price":67.53},{"date":"2026-03-05","price":68.29},{"date":"2026-03-06","price":67.79},{"date":"2026-03-09","price":69.49},{"date":"2026-03-10","price":68.83},{"date":"2026-03-11","price":67.98},{"date":"2026-03-12","price":67.18},{"date":"2026-03-13","price":68.36},{"date":"2026-03-16","price":68.97},{"date":"2026-03-17","price":69.63},{"date":"2026-03-18","price":68.8},{"date":"2026-03-19","price":67.84},{"date":"2026-03-20","price":69.19}],"crude_brent":[{"date":"2026-02-09","price":84.02},{"date":"2026-02-10","price":84.21},{"date":"2026-02-11","price":85.16},{"date":"2026-02-12","price":85.46},{"date":"2026-02-13","price":84.11},{"date":"2026-02-16","price":85.61},{"date":"2026-02-17","price":85.18},{"date":"2026-02-18","price":87.02},{"date":"2026-02-19","price":85.76},{"date":"2026-02-20","price":85.4},{"date":"2026-02-23","price":86.18},{"date":"2026-02-24","price":86.68},{"date":"2026-02-25","price":85.45},{"date":"2026-02-26","price":84.42},{"date":"2026-02-27","price":84.42},{"date":"2026-03-02","price":82.45},{"date":"2026-03-03","price":81.47},{"date":"2026-03-04","price":82.21},{"date":"2026-03-05","price":82.51},{"date":"2026-03-06","price":82.26},{"date":"2026-03-09","price":83.97},{"date":"2026-03-10","price":83.18},{"date":"2026-03-11","price":84.27},{"date":"2026-03-12","price":84.25},{"date":"2026-03-13","price":84.58},{"date":"2026-03-16","price":82.6},{"date":"2026-03-17","price":82.97},{"date":"2026-03-18","price":83.49},{"date":"2026-03-19","price":83.4},{"date":"2026-03-20","price":83.21}],"gasoline_rbob":[{"date":"2026-02-09","price":2.33},{"date":"2026-02-10","price":2.32},{"date":"2026-02-11","price":2.3},{"date":"2026-02-12","price":2.19},{"date":"2026-02-13","price":2.17},{"date":"2026-02-16","price":2.16},{"date":"2026-02-17","price":2.17},{"date":"2026-02-18","price":2.19},{"date":"2026-02-19","price":2.24},{"date":"2026-02-20","price":2.24},{"date":"2026-02-23","price":2.18},{"date":"2026-02-24","price":2.17},{"date":"2026-02-25","price":2.17},{"date":"2026-02-26","price":2.14},{"date":"2026-02-27","price":2.16},{"date":"2026-03-02","price":2.12},{"date":"2026-03-03","price":2.14},{"date":"2026-03-04","price":2.27},{"date":"2026-03-05","price":2.26},{"date":"2026-03-06","price":2.25},{"date":"2026-03-09","price":2.23},{"date":"2026-03-10","price":2.24},{"date":"2026-03-11","price":2.25},{"date":"2026-03-12","price":2.23},{"date":"2026-03-13","price":2.24},{"date":"2026-03-16","price":2.33},{"date":"2026-03-17","price":2.3},{"date":"2026-03-18","price":2.33},{"date":"2026-03-19","price":2.32},{"date":"2026-03-20","price":2.33}],"diesel_ulsd":[{"date":"2026-02-09","price":2.66},{"date":"2026-02-10","price":2.69},{"date":"2026-02-11","price":2.63},{"date":"2026-02-12","price":2.66},{"date":"2026-02-13","price":2.69},{"date":"2026-02-16","price":2.7},{"date":"2026-02-17","price":2.68},{"date":"2026-02-18","price":2.61},{"date":"2026-02-19","price":2.56},{"date":"2026-02-20","price":2.57},{"date":"2026-02-23","price":2.59},{"date":"2026-02-24","price":2.52},{"date":"2026-02-25","price":2.62},{"date":"2026-02-26","price":2.64},{"date":"2026-02-27","price":2.68},{"date":"2026-03-02","price":2.69},{"date":"2026-03-03","price":2.64},{"date":"2026-03-04","price":2.67},{"date":"2026-03-05","price":2.66},{"date":"2026-03-06","price":2.67},{"date":"2026-03-09","price":2.64},{"date":"2026-03-10","price":2.62},{"date":"2026-03-11","price":2.6},{"date":"2026-03-12","price":2.64},{"date":"2026-03-13","price":2.68},{"date":"2026-03-16","price":2.62},{"date":"2026-03-17","price":2.63},{"date":"2026-03-18","price":2.64},{"date":"2026-03-19","price":2.65},{"date":"2026-03-20","price":2.63}],"heating_oil":[{"date":"2026-02-09","price":2.48},{"date":"2026-02-10","price":2.52},{"date":"2026-02-11","price":2.51},{"date":"2026-02-12","price":2.56},{"date":"2026-02-13","price":2.57},{"date":"2026-02-16","price":2.59},{"date":"2026-02-17","price":2.58},{"date":"2026-02-18","price":2.62},{"date":"2026-02-19","price":2.57},{"date":"2026-02-20","price":2.5},{"date":"2026-02-23","price":2.5},{"date":"2026-02-24","price":2.49},{"date":"2026-02-25","price":2.49},{"date":"2026-02-26","price":2.44},{"date":"2026-02-27","price":2.47},{"date":"2026-03-02","price":2.55},{"date":"2026-03-03","price":2.6},{"date":"2026-03-04","price":2.63},{"date":"2026-03-05","price":2.64},{"date":"2026-03-06","price":2.65},{"date":"2026-03-09","price":2.68},{"date":"2026-03-10","price":2.64},{"date":"2026-03-11","price":2.63},{"date":"2026-03-12","price":2.65},{"date":"2026-03-13","price":2.66},{"date":"2026-03-16","price":2.71},{"date":"2026-03-17","price":2.77},{"date":"2026-03-18","price":2.75},{"date":"2026-03-19","price":2.79},{"date":"2026-03-20","price":2.73}],"jet_fuel":[{"date":"2026-02-09","price":2.77},{"date":"2026-02-10","price":2.82},{"date":"2026-02-11","price":2.81},{"date":"2026-02-12","price":2.78},{"date":"2026-02-13","price":2.83},{"date":"2026-02-16","price":2.86},{"date":"2026-02-17","price":2.8},{"date":"2026-02-18","price":2.77},{"date":"2026-02-19","price":2.75},{"date":"2026-02-20","price":2.76},{"date":"2026-02-23","price":2.72},{"date":"2026-02-24","price":2.73},{"date":"2026-02-25","price":2.72},{"date":"2026-02-26","price":2.74},{"date":"2026-02-27","price":2.68},{"date":"2026-03-02","price":2.69},{"date":"2026-03-03","price":2.67},{"date":"2026-03-04","price":2.63},{"date":"2026-03-05","price":2.55},{"date":"2026-03-06","price":2.54},{"date":"2026-03-09","price":2.57},{"date":"2026-03-10","price":2.51},{"date":"2026-03-11","price":2.52},{"date":"2026-03-12","price":2.58},{"date":"2026-03-13","price":2.56},{"date":"2026-03-16","price":2.6},{"date":"2026-03-17","price":2.61},{"date":"2026-03-18","price":2.6},{"date":"2026-03-19","price":2.55},{"date":"2026-03-20","price":2.53}],"natural_gas":[{"date":"2026-02-09","price":3.08},{"date":"2026-02-10","price":2.9},{"date":"2026-02-11","price":3.03},{"date":"2026-02-12","price":3.02},{"date":"2026-02-13","price":3.09},{"date":"2026-02-16","price":3.19},{"date":"2026-02-17","price":3.23},{"date":"2026-02-18","price":3.26},{"date":"2026-02-19","price":3.15},{"date":"2026-02-20","price":3.02},{"date":"2026-02-23","price":3.07},{"date":"2026-02-24","price":3.13},{"date":"2026-02-25","price":3.24},{"date":"2026-02-26","price":3.24},{"date":"2026-02-27","price":3.19},{"date":"2026-03-02","price":3.14},{"date":"2026-03-03","price":3.17},{"date":"2026-03-04","price":3.13},{"date":"2026-03-05","price":3.16},{"date":"2026-03-06","price":3.21},{"date":"2026-03-09","price":3.29},{"date":"2026-03-10","price":3.29},{"date":"2026-03-11","price":3.34},{"date":"2026-03-12","price":3.13},{"date":"2026-03-13","price":3.07},{"date":"2026-03-16","price":2.98},{"date":"2026-03-17","price":3.13},{"date":"2026-03-18","price":3.11},{"date":"2026-03-19","price":3.01},{"date":"2026-03-20","price":2.94}],"propane":[{"date":"2026-02-09","price":0.8},{"date":"2026-02-10","price":0.77},{"date":"2026-02-11","price":0.8},{"date":"2026-02-12","price":0.82},{"date":"2026-02-13","price":0.79},{"date":"2026-02-16","price":0.77},{"date":"2026-02-17","price":0.77},{"date":"2026-02-18","price":0.77},{"date":"2026-02-19","price":0.77},{"date":"2026-02-20","price":0.78},{"date":"2026-02-23","price":0.79},{"date":"2026-02-24","price":0.79},{"date":"2026-02-25","price":0.8},{"date":"2026-02-26","price":0.79},{"date":"2026-02-27","price":0.8},{"date":"2026-03-02","price":0.82},{"date":"2026-03-03","price":0.8},{"date":"2026-03-04","price":0.8},{"date":"2026-03-05","price":0.82},{"date":"2026-03-06","price":0.81},{"date":"2026-03-09","price":0.81},{"date":"2026-03-10","price":0.81},{"date":"2026-03-11","price":0.84},{"date":"2026-03-12","price":0.84},{"date":"2026-03-13","price":0.84},{"date":"2026-03-16","price":0.86},{"date":"2026-03-17","price":0.89},{"date":"2026-03-18","price":0.89},{"date":"2026-03-19","price":0.88},{"date":"2026-03-20","price":0.88}],"naphtha":[{"date":"2026-02-09","price":612.85},{"date":"2026-02-10","price":606.18},{"date":"2026-02-11","price":592.82},{"date":"2026-02-12","price":578.82},{"date":"2026-02-13","price":575.77},{"date":"2026-02-16","price":578.7},{"date":"2026-02-17","price":577.54},{"date":"2026-02-18","price":581.75},{"date":"2026-02-19","price":585.26},{"date":"2026-02-20","price":592.31},{"date":"2026-02-23","price":581.47},{"date":"2026-02-24","price":582.56},{"date":"2026-02-25","price":580.14},{"date":"2026-02-26","price":585.58},{"date":"2026-02-27","price":589.62},{"date":"2026-03-02","price":592.22},{"date":"2026-03-03","price":594.84},{"date":"2026-03-04","price":595.33},{"date":"2026-03-05","price":610.67},{"date":"2026-03-06","price":605.93},{"date":"2026-03-09","price":612.48},{"date":"2026-03-10","price":622.13},{"date":"2026-03-11","price":620.23},{"date":"2026-03-12","price":618.06},{"date":"2026-03-13","price":625.15},{"date":"2026-03-16","price":625.51},{"date":"2026-03-17","price":626.87},{"date":"2026-03-18","price":627.69},{"date":"2026-03-19","price":623.82},{"date":"2026-03-20","price":619.25}],"fuel_oil":[{"date":"2026-02-09","price":417.86},{"date":"2026-02-10","price":412.03},{"date":"2026-02-11","price":405.6},{"date":"2026-02-12","price":409.9},{"date":"2026-02-13","price":417.25},{"date":"2026-02-16","price":414.58},{"date":"2026-02-17","price":412.34},{"date":"2026-02-18","price":420.12},{"date":"2026-02-19","price":416.21},{"date":"2026-02-20","price":418.01},{"date":"2026-02-23","price":416.47},{"date":"2026-02-24","price":410.58},{"date":"2026-02-25","price":396.27},{"date":"2026-02-26","price":394},{"date":"2026-02-27","price":390.96},{"date":"2026-03-02","price":392.62},{"date":"2026-03-03","price":392.04},{"date":"2026-03-04","price":394.02},{"date":"2026-03-05","price":390.08},{"date":"2026-03-06","price":387.93},{"date":"2026-03-09","price":389.84},{"date":"2026-03-10","price":393.76},{"date":"2026-03-11","price":390.11},{"date":"2026-03-12","price":392.65},{"date":"2026-03-13","price":396.16},{"date":"2026-03-16","price":398.64},{"date":"2026-03-17","price":390.48},{"date":"2026-03-18","price":389.78},{"date":"2026-03-19","price":398.07},{"date":"2026-03-20","price":399.67}],"lpg":[{"date":"2026-02-09","price":526.34},{"date":"2026-02-10","price":536.83},{"date":"2026-02-11","price":542.97},{"date":"2026-02-12","price":544.41},{"date":"2026-02-13","price":548.19},{"date":"2026-02-16","price":538.04},{"date":"2026-02-17","price":541.27},{"date":"2026-02-18","price":531.51},{"date":"2026-02-19","price":530.5},{"date":"2026-02-20","price":520.47},{"date":"2026-02-23","price":523.44},{"date":"2026-02-24","price":527.12},{"date":"2026-02-25","price":525.23},{"date":"2026-02-26","price":530.17},{"date":"2026-02-27","price":532.23},{"date":"2026-03-02","price":518.3},{"date":"2026-03-03","price":528.47},{"date":"2026-03-04","price":513.08},{"date":"2026-03-05","price":505.83},{"date":"2026-03-06","price":503.56},{"date":"2026-03-09","price":508.28},{"date":"2026-03-10","price":508.46},{"date":"2026-03-11","price":507.66},{"date":"2026-03-12","price":517.23},{"date":"2026-03-13","price":523.92},{"date":"2026-03-16","price":533.76},{"date":"2026-03-17","price":532.3},{"date":"2026-03-18","price":537.47},{"date":"2026-03-19","price":538.72},{"date":"2026-03-20","price":534.93}],"bitumen":[{"date":"2026-02-09","price":376.92},{"date":"2026-02-10","price":377.74},{"date":"2026-02-11","price":380.96},{"date":"2026-02-12","price":386.91},{"date":"2026-02-13","price":388.88},{"date":"2026-02-16","price":385.96},{"date":"2026-02-17","price":388.65},{"date":"2026-02-18","price":390.3},{"date":"2026-02-19","price":390.34},{"date":"2026-02-20","price":385.16},{"date":"2026-02-23","price":388.84},{"date":"2026-02-24","price":389.15},{"date":"2026-02-25","price":389.69},{"date":"2026-02-26","price":390.54},{"date":"2026-02-27","price":390.93},{"date":"2026-03-02","price":391.61},{"date":"2026-03-03","price":389.38},{"date":"2026-03-04","price":393.47},{"date":"2026-03-05","price":392.61},{"date":"2026-03-06","price":392.16},{"date":"2026-03-09","price":394.65},{"date":"2026-03-10","price":396.01},{"date":"2026-03-11","price":392.77},{"date":"2026-03-12","price":390.52},{"date":"2026-03-13","price":385.4},{"date":"2026-03-16","price":383.51},{"date":"2026-03-17","price":391.85},{"date":"2026-03-18","price":390.91},{"date":"2026-03-19","price":394.42},{"date":"2026-03-20","price":392.74}]};

const SECURITIES = {"crude_wti":{"label":"WTI Crude Oil","securities":[{"ticker":"XOM","name":"Exxon Mobil","type":"Stock","exposure":"Integrated major, largest US oil producer"},{"ticker":"CVX","name":"Chevron","type":"Stock","exposure":"Integrated major, heavy Permian Basin presence"},{"ticker":"COP","name":"ConocoPhillips","type":"Stock","exposure":"Pure-play E&P, largest independent US producer"},{"ticker":"EOG","name":"EOG Resources","type":"Stock","exposure":"Premium shale driller, Eagle Ford & Permian"},{"ticker":"PXD","name":"Pioneer Natural Resources","type":"Stock","exposure":"Top Permian Basin pure-play producer"},{"ticker":"OXY","name":"Occidental Petroleum","type":"Stock","exposure":"Permian E&P with carbon capture initiatives"},{"ticker":"USO","name":"United States Oil Fund","type":"ETF","exposure":"Tracks WTI front-month futures directly"},{"ticker":"BNO","name":"US Brent Oil Fund","type":"ETF","exposure":"Brent crude futures exposure"},{"ticker":"DBO","name":"Invesco DB Oil Fund","type":"ETF","exposure":"Optimized roll yield crude oil ETF"},{"ticker":"XLE","name":"Energy Select Sector SPDR","type":"ETF","exposure":"Broad S&P 500 energy sector basket"}]},"crude_brent":{"label":"Brent Crude Oil","securities":[{"ticker":"SHEL","name":"Shell plc","type":"Stock","exposure":"Global integrated major, North Sea heritage"},{"ticker":"BP","name":"BP plc","type":"Stock","exposure":"UK-based integrated, global upstream/downstream"},{"ticker":"TTE","name":"TotalEnergies","type":"Stock","exposure":"French integrated major, diversified global assets"},{"ticker":"EQNR","name":"Equinor ASA","type":"Stock","exposure":"Norwegian state-backed, North Sea dominant"},{"ticker":"ENI","name":"Eni S.p.A.","type":"Stock","exposure":"Italian integrated, Africa & Mediterranean focus"},{"ticker":"CNQ","name":"Canadian Natural Resources","type":"Stock","exposure":"Canadas largest oil producer, oil sands"},{"ticker":"BNO","name":"US Brent Oil Fund","type":"ETF","exposure":"Tracks Brent crude futures directly"},{"ticker":"IEO","name":"iShares US Oil & Gas E&P","type":"ETF","exposure":"US exploration & production companies"},{"ticker":"XOP","name":"SPDR S&P Oil & Gas E&P","type":"ETF","exposure":"Equal-weight E&P companies"},{"ticker":"FILL","name":"iShares MSCI Global Energy","type":"ETF","exposure":"Global energy equities across markets"}]},"gasoline_rbob":{"label":"RBOB Gasoline","securities":[{"ticker":"MPC","name":"Marathon Petroleum","type":"Stock","exposure":"Largest US refiner by capacity"},{"ticker":"VLO","name":"Valero Energy","type":"Stock","exposure":"Major independent refiner, gasoline focused"},{"ticker":"PSX","name":"Phillips 66","type":"Stock","exposure":"Refining, midstream, and chemicals"},{"ticker":"HFC","name":"HF Sinclair","type":"Stock","exposure":"Independent refiner, Rocky Mountain region"},{"ticker":"DK","name":"Delek US Holdings","type":"Stock","exposure":"Regional refiner, US mid-continent"},{"ticker":"PBF","name":"PBF Energy","type":"Stock","exposure":"East Coast & mid-continent refiner"},{"ticker":"CASY","name":"Caseys General Stores","type":"Stock","exposure":"Fuel retail, gasoline margins proxy"},{"ticker":"UGA","name":"United States Gasoline Fund","type":"ETF","exposure":"Tracks RBOB gasoline futures directly"},{"ticker":"CRAK","name":"VanEck Oil Refiners ETF","type":"ETF","exposure":"Global refining companies basket"},{"ticker":"XLE","name":"Energy Select Sector SPDR","type":"ETF","exposure":"Broad energy sector with refiner weight"}]},"diesel_ulsd":{"label":"Ultra-Low Sulfur Diesel","securities":[{"ticker":"VLO","name":"Valero Energy","type":"Stock","exposure":"Largest diesel refiner in US"},{"ticker":"MPC","name":"Marathon Petroleum","type":"Stock","exposure":"Major distillate producer"},{"ticker":"PSX","name":"Phillips 66","type":"Stock","exposure":"Significant diesel/distillate output"},{"ticker":"HFC","name":"HF Sinclair","type":"Stock","exposure":"Diesel-heavy refiner mix"},{"ticker":"PBF","name":"PBF Energy","type":"Stock","exposure":"East Coast diesel supply refiner"},{"ticker":"PAA","name":"Plains All American","type":"Stock","exposure":"Crude/refined product pipelines"},{"ticker":"CVRR","name":"CVR Partners","type":"Stock","exposure":"Nitrogen fertilizer from petroleum coke"},{"ticker":"CRAK","name":"VanEck Oil Refiners ETF","type":"ETF","exposure":"Refining crack spread exposure"},{"ticker":"UGA","name":"United States Gasoline Fund","type":"ETF","exposure":"Refined products price proxy"},{"ticker":"IEO","name":"iShares US Oil & Gas E&P","type":"ETF","exposure":"Upstream/midstream exposure"}]},"heating_oil":{"label":"Heating Oil","securities":[{"ticker":"VLO","name":"Valero Energy","type":"Stock","exposure":"Top distillate refiner"},{"ticker":"MPC","name":"Marathon Petroleum","type":"Stock","exposure":"Major heating oil season supplier"},{"ticker":"PSX","name":"Phillips 66","type":"Stock","exposure":"Northeast heating oil supplier"},{"ticker":"SUN","name":"Sunoco LP","type":"Stock","exposure":"Fuel distribution including heating oil"},{"ticker":"SPH","name":"Suburban Propane Partners","type":"Stock","exposure":"Heating fuel distributor"},{"ticker":"PARR","name":"Par Pacific Holdings","type":"Stock","exposure":"Regional refiner with distillate focus"},{"ticker":"PBF","name":"PBF Energy","type":"Stock","exposure":"Northeast refining operations"},{"ticker":"CRAK","name":"VanEck Oil Refiners ETF","type":"ETF","exposure":"Refiner equities basket"},{"ticker":"XLE","name":"Energy Select Sector SPDR","type":"ETF","exposure":"Broad energy sector"},{"ticker":"VDE","name":"Vanguard Energy ETF","type":"ETF","exposure":"Low-cost broad energy exposure"}]},"jet_fuel":{"label":"Jet Fuel (Kerosene)","securities":[{"ticker":"MPC","name":"Marathon Petroleum","type":"Stock","exposure":"Major jet fuel refiner for US airlines"},{"ticker":"VLO","name":"Valero Energy","type":"Stock","exposure":"Significant jet/kerosene output"},{"ticker":"PSX","name":"Phillips 66","type":"Stock","exposure":"Aviation fuel producer"},{"ticker":"DAL","name":"Delta Air Lines","type":"Stock","exposure":"Airline with own refinery (Trainer, PA)"},{"ticker":"AAL","name":"American Airlines","type":"Stock","exposure":"Largest airline, inverse jet fuel exposure"},{"ticker":"UAL","name":"United Airlines","type":"Stock","exposure":"Major airline, fuel cost sensitivity"},{"ticker":"LUV","name":"Southwest Airlines","type":"Stock","exposure":"Known for fuel hedging strategies"},{"ticker":"JETS","name":"US Global Jets ETF","type":"ETF","exposure":"Airline sector basket, inverse fuel proxy"},{"ticker":"CRAK","name":"VanEck Oil Refiners ETF","type":"ETF","exposure":"Jet fuel refining margin exposure"},{"ticker":"IYT","name":"iShares Transportation Avg","type":"ETF","exposure":"Transport sector fuel cost sensitivity"}]},"natural_gas":{"label":"Natural Gas","securities":[{"ticker":"EQT","name":"EQT Corporation","type":"Stock","exposure":"Largest US natural gas producer"},{"ticker":"SWN","name":"Southwestern Energy","type":"Stock","exposure":"Appalachian Basin gas producer"},{"ticker":"AR","name":"Antero Resources","type":"Stock","exposure":"Appalachian gas & NGL producer"},{"ticker":"RRC","name":"Range Resources","type":"Stock","exposure":"Marcellus Shale gas pure-play"},{"ticker":"CHK","name":"Chesapeake Energy","type":"Stock","exposure":"Haynesville & Marcellus gas producer"},{"ticker":"LNG","name":"Cheniere Energy","type":"Stock","exposure":"Largest US LNG exporter"},{"ticker":"KMI","name":"Kinder Morgan","type":"Stock","exposure":"Largest US gas pipeline operator"},{"ticker":"UNG","name":"United States Nat Gas Fund","type":"ETF","exposure":"Tracks Henry Hub gas futures directly"},{"ticker":"BOIL","name":"ProShares Ultra Bloomberg NG","type":"ETF","exposure":"2x leveraged natural gas futures"},{"ticker":"FCG","name":"First Trust Nat Gas ETF","type":"ETF","exposure":"Natural gas equity producers basket"}]},"propane":{"label":"Propane","securities":[{"ticker":"TRGP","name":"Targa Resources","type":"Stock","exposure":"NGL gathering, processing & fractionation"},{"ticker":"WMB","name":"Williams Companies","type":"Stock","exposure":"Gas processing with NGL extraction"},{"ticker":"OKE","name":"ONEOK","type":"Stock","exposure":"NGL pipelines and fractionation"},{"ticker":"AM","name":"Antero Midstream","type":"Stock","exposure":"NGL gathering and processing"},{"ticker":"SPH","name":"Suburban Propane Partners","type":"Stock","exposure":"Largest US propane distributor"},{"ticker":"SHLX","name":"Shell Midstream Partners","type":"Stock","exposure":"NGL pipeline operations"},{"ticker":"AR","name":"Antero Resources","type":"Stock","exposure":"Major NGL/propane producer"},{"ticker":"AMLP","name":"Alerian MLP ETF","type":"ETF","exposure":"Midstream MLP basket, NGL exposure"},{"ticker":"MLPA","name":"Global X MLP ETF","type":"ETF","exposure":"MLP equities with NGL transport"},{"ticker":"XLE","name":"Energy Select Sector SPDR","type":"ETF","exposure":"Broad energy with midstream weight"}]},"naphtha":{"label":"Naphtha","securities":[{"ticker":"LYB","name":"LyondellBasell","type":"Stock","exposure":"Global petrochemicals, naphtha cracker operator"},{"ticker":"DOW","name":"Dow Inc","type":"Stock","exposure":"Chemicals giant, naphtha feedstock user"},{"ticker":"CE","name":"Celanese Corp","type":"Stock","exposure":"Specialty chemicals from petroleum derivatives"},{"ticker":"EMN","name":"Eastman Chemical","type":"Stock","exposure":"Chemicals producer, naphtha-based products"},{"ticker":"SHEL","name":"Shell plc","type":"Stock","exposure":"Major naphtha trader and cracker operator"},{"ticker":"TSE","name":"Trinseo","type":"Stock","exposure":"Plastics & latex from petroleum feedstock"},{"ticker":"BASFY","name":"BASF SE","type":"Stock","exposure":"Worlds largest chemical company, Verbund"},{"ticker":"XLB","name":"Materials Select Sector SPDR","type":"ETF","exposure":"Materials sector including chemicals"},{"ticker":"VAW","name":"Vanguard Materials ETF","type":"ETF","exposure":"Broad materials with chemical producers"},{"ticker":"IYM","name":"iShares US Basic Materials","type":"ETF","exposure":"US chemicals and materials basket"}]},"fuel_oil":{"label":"Fuel Oil (380 CST)","securities":[{"ticker":"STNG","name":"Scorpio Tankers","type":"Stock","exposure":"Product tanker fleet, bunker fuel consumer"},{"ticker":"FRO","name":"Frontline plc","type":"Stock","exposure":"VLCC tanker operator, major fuel oil buyer"},{"ticker":"INSW","name":"International Seaways","type":"Stock","exposure":"Crude tanker fleet, bunker cost exposure"},{"ticker":"TNK","name":"Teekay Tankers","type":"Stock","exposure":"Mid-size tanker fleet"},{"ticker":"TRMD","name":"TORM plc","type":"Stock","exposure":"Product tanker, fuel oil shipping"},{"ticker":"ZIM","name":"ZIM Integrated Shipping","type":"Stock","exposure":"Container shipping, large bunker spend"},{"ticker":"DAC","name":"Danaos Corp","type":"Stock","exposure":"Containership lessor, fuel cost pass-through"},{"ticker":"BDRY","name":"Breakwave Dry Bulk Ship ETF","type":"ETF","exposure":"Dry bulk freight rates, fuel cost proxy"},{"ticker":"BOAT","name":"SonicShares Intl Shipping","type":"ETF","exposure":"Global shipping companies basket"},{"ticker":"SEA","name":"US Global Sea to Sky ETF","type":"ETF","exposure":"Cargo shipping & logistics"}]},"lpg":{"label":"LPG","securities":[{"ticker":"TRGP","name":"Targa Resources","type":"Stock","exposure":"NGL processing and fractionation"},{"ticker":"OKE","name":"ONEOK","type":"Stock","exposure":"NGL pipelines, LPG transport"},{"ticker":"WMB","name":"Williams Companies","type":"Stock","exposure":"Gas processing with LPG extraction"},{"ticker":"EPD","name":"Enterprise Products","type":"Stock","exposure":"Largest US NGL pipeline & export terminal"},{"ticker":"ET","name":"Energy Transfer","type":"Stock","exposure":"Diversified midstream, NGL/LPG transport"},{"ticker":"MPLX","name":"MPLX LP","type":"Stock","exposure":"Gathering, processing & fractionation"},{"ticker":"LNG","name":"Cheniere Energy","type":"Stock","exposure":"LNG export with LPG co-products"},{"ticker":"AMLP","name":"Alerian MLP ETF","type":"ETF","exposure":"Midstream MLPs with NGL exposure"},{"ticker":"EMLP","name":"First Trust NA Energy Infra","type":"ETF","exposure":"Energy infrastructure with LPG transport"},{"ticker":"XLE","name":"Energy Select Sector SPDR","type":"ETF","exposure":"Broad energy with midstream weight"}]},"bitumen":{"label":"Bitumen","securities":[{"ticker":"SU","name":"Suncor Energy","type":"Stock","exposure":"Canadas largest oil sands / bitumen producer"},{"ticker":"CVE","name":"Cenovus Energy","type":"Stock","exposure":"Oil sands producer, heavy oil upgrader"},{"ticker":"IMO","name":"Imperial Oil","type":"Stock","exposure":"Oil sands & bitumen upgrading (Exxon subsidiary)"},{"ticker":"CNQ","name":"Canadian Natural Resources","type":"Stock","exposure":"Horizon & Jackpine oil sands operations"},{"ticker":"MEG","name":"MEG Energy","type":"Stock","exposure":"Christina Lake SAGD bitumen producer"},{"ticker":"ATH","name":"Athabasca Oil Corp","type":"Stock","exposure":"Thermal oil sands producer"},{"ticker":"SJR.B","name":"Shaw Industries","type":"Stock","exposure":"Asphalt & paving materials"},{"ticker":"VMC","name":"Vulcan Materials","type":"Stock","exposure":"Road construction materials, asphalt buyer"},{"ticker":"XEG","name":"iShares S&P/TSX Capped Energy","type":"ETF","exposure":"Canadian energy equities with oil sands"},{"ticker":"FENY","name":"Fidelity MSCI Energy ETF","type":"ETF","exposure":"Low-cost broad energy exposure"}]}};

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

const AMEX_ETFS = new Set(['USO','BNO','DBO','UGA','UNG','BOIL','CRAK','BDRY','BOAT','SEA','JETS','AMLP','MLPA','EMLP','XLE','XOP','XLB','IEO','IYT','IYM','VDE','VAW','FILL','FENY','FCG','XEG']);
const NASDAQ_TICKERS = new Set(['PARR','CASY']);

function tvSymbol(ticker) {
  if (AMEX_ETFS.has(ticker)) return 'AMEX:' + ticker;
  if (NASDAQ_TICKERS.has(ticker)) return 'NASDAQ:' + ticker;
  return 'NYSE:' + ticker;
}

function formatPrice(price, unit) {
  if (price == null) return '-';
  const decimals = price >= 10 ? 2 : 3;
  return (
    <>
      <span className="price">{price.toFixed(decimals)}</span>
      <span className="unit">{unit}</span>
    </>
  );
}

function PctChange({ value }) {
  if (value == null) return <span className="change flat">N/A</span>;
  const dir = value > 0.05 ? 'up' : value < -0.05 ? 'down' : 'flat';
  const arrow = dir === 'up' ? '\u25B2' : dir === 'down' ? '\u25BC' : '\u25AC';
  const sign = value > 0 ? '+' : '';
  return (
    <span className={`change ${dir}`}>
      <span className="arrow">{arrow}</span>
      {sign}{value.toFixed(2)}%
    </span>
  );
}

function Sparkline({ data }) {
  if (!data || data.length < 2) return null;
  const W = 110, H = 32;
  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * W;
    const y = H - ((p - min) / range) * (H - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  const up = prices[prices.length - 1] >= prices[0];
  return (
    <svg className="sparkline" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline
        fill="none"
        stroke={up ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        points={pts}
      />
    </svg>
  );
}

function TVMiniWidget({ ticker }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'tradingview-widget-container';
    container.style.height = '100%';
    container.style.width = '100%';
    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.textContent = JSON.stringify({
      symbol: tvSymbol(ticker),
      width: '100%',
      height: '100%',
      locale: 'en',
      dateRange: '1M',
      colorTheme: 'dark',
      isTransparent: true,
      autosize: true,
      largeChartUrl: '',
      noTimeScale: false,
    });
    container.appendChild(script);
    el.appendChild(container);
  }, [ticker]);
  return <div ref={ref} className="tv-widget-container" />;
}

const INTERVAL_MAP = { '1W': 'D', '1M': 'D', '3M': 'W', '1Y': 'W', 'YTD': 'D' };
const RANGE_MAP    = { '1W': '5D', '1M': '1M', '3M': '3M', '1Y': '12M', 'YTD': 'YTD' };

function TVDetailChart({ ticker, interval }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'tradingview-widget-container';
    container.style.height = '100%';
    container.style.width = '100%';
    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.textContent = JSON.stringify({
      autosize: true,
      symbol: tvSymbol(ticker),
      interval: INTERVAL_MAP[interval] || 'D',
      timezone: 'America/New_York',
      theme: 'dark',
      style: '3',
      locale: 'en',
      backgroundColor: '#1e2d3d',
      gridColor: '#2a3f52',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      range: RANGE_MAP[interval] || '1M',
      allow_symbol_change: true,
    });
    container.appendChild(script);
    el.appendChild(container);
  }, [ticker, interval]);
  return <div ref={ref} className="tv-detail-chart" />;
}

function TVTickerTape() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'tradingview-widget-container';
    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.textContent = JSON.stringify({
      symbols: [
        { proName: 'NYMEX:CL1!', title: 'WTI Crude' },
        { proName: 'NYMEX:BZ1!', title: 'Brent Crude' },
        { proName: 'NYMEX:RB1!', title: 'RBOB Gas' },
        { proName: 'NYMEX:HO1!', title: 'Heating Oil' },
        { proName: 'NYMEX:NG1!', title: 'Nat Gas' },
        { proName: 'AMEX:USO',   title: 'USO' },
        { proName: 'AMEX:XLE',   title: 'XLE' },
        { proName: 'NYSE:XOM',   title: 'XOM' },
        { proName: 'NYSE:CVX',   title: 'CVX' },
        { proName: 'NYSE:MPC',   title: 'MPC' },
        { proName: 'NYSE:LNG',   title: 'LNG' },
        { proName: 'NYSE:VLO',   title: 'VLO' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    });
    container.appendChild(script);
    el.appendChild(container);
  }, []);
  return <div ref={ref} className="tv-ticker-tape" />;
}

function SecuritiesPanel({ productId }) {
  const sec = SECURITIES[productId];
  const [ticker, setTicker] = useState(sec ? sec.securities[0].ticker : null);
  const [interval, setIntervalRange] = useState('1M');

  if (!sec) {
    return (
      <div className="securities-inner">
        <em style={{ color: 'var(--text-secondary)' }}>No related securities data</em>
      </div>
    );
  }

  return (
    <div className="securities-panel open">
      <div className="securities-inner">
        <div className="securities-header">
          <h4>Top 10 Related Stocks &amp; ETFs &mdash; Live TradingView Data</h4>
          <div className="securities-legend">
            <span className="legend-item"><span className="legend-dot stock" />Stock</span>
            <span className="legend-item"><span className="legend-dot etf" />ETF</span>
          </div>
        </div>

        <div className="tv-symbols-grid">
          {sec.securities.map(s => {
            const typeLower = s.type.toLowerCase();
            const selected = s.ticker === ticker;
            return (
              <div
                key={s.ticker}
                className="tv-symbol-card"
                style={{
                  cursor: 'pointer',
                  borderColor: selected ? 'var(--accent)' : 'var(--border)',
                }}
                onClick={() => setTicker(s.ticker)}
              >
                <div className="card-header">
                  <span className={`security-badge ${typeLower}`}>{s.type}</span>
                  <span className="card-ticker">{s.ticker}</span>
                  <span className="card-name">{s.name}</span>
                  <span className="card-exposure" title={s.exposure}>{s.exposure}</span>
                </div>
                <TVMiniWidget ticker={s.ticker} />
              </div>
            );
          })}
        </div>

        <div className="tv-detail-section">
          <div className="tv-detail-header">
            <span>{ticker ? `${ticker} detailed chart` : 'Click a ticker above for detailed chart'}</span>
            <div className="tv-detail-tabs">
              {['1W', '1M', '3M', 'YTD', '1Y'].map(iv => (
                <button
                  key={iv}
                  className={`tv-detail-tab ${iv === interval ? 'active' : ''}`}
                  onClick={() => setIntervalRange(iv)}
                >
                  {iv}
                </button>
              ))}
            </div>
          </div>
          {ticker && <TVDetailChart ticker={ticker} interval={interval} />}
        </div>

        <div className="tv-source-note">Powered by TradingView</div>
      </div>
    </div>
  );
}

function ProductRow({ product }) {
  const kpi = KPIS[product.id];
  const [open, setOpen] = useState(false);
  if (!kpi) return null;

  return (
    <>
      <tr className="product-row" onClick={() => setOpen(o => !o)}>
        <td>
          <div className="product-cell">
            <span className="product-name">
              <span className={`expand-icon ${open ? 'open' : ''}`}>&#9654;</span>
              {product.name}
            </span>
            <span className="product-category" style={{ marginLeft: 22 }}>
              {product.category} &middot; 10 related securities
            </span>
          </div>
        </td>
        <td className="right">{formatPrice(kpi.currentPrice, product.unit)}</td>
        <td className="right"><PctChange value={kpi.wow.pctChange} /></td>
        <td className="right"><PctChange value={kpi.mtd.pctChange} /></td>
        <td className="right"><PctChange value={kpi.ytd.pctChange} /></td>
        <td className="sparkline-cell">
          <Sparkline data={PRICE_HISTORY_30D[product.id]} />
        </td>
      </tr>
      {open && (
        <tr className="securities-row">
          <td colSpan={6}>
            <SecuritiesPanel productId={product.id} />
          </td>
        </tr>
      )}
    </>
  );
}

function SummaryCards({ filtered }) {
  const summary = useMemo(() => {
    let gainers = 0, losers = 0, total = 0, count = 0;
    for (const p of filtered) {
      const kpi = KPIS[p.id];
      if (!kpi || kpi.wow.pctChange == null) continue;
      if (kpi.wow.pctChange > 0.05) gainers++;
      else if (kpi.wow.pctChange < -0.05) losers++;
      total += kpi.wow.pctChange;
      count++;
    }
    return { count: filtered.length, gainers, losers, avgWow: count > 0 ? total / count : 0 };
  }, [filtered]);

  return (
    <div className="summary-row">
      <div className="summary-card">
        <div className="label">Products Tracked</div>
        <div className="value">{summary.count}</div>
        <div className="sub" style={{ color: 'var(--text-secondary)' }}>All categories</div>
      </div>
      <div className="summary-card">
        <div className="label">Weekly Gainers</div>
        <div className="value" style={{ color: 'var(--green)' }}>{summary.gainers}</div>
        <div className="sub" style={{ color: 'var(--green)' }}>products up WoW</div>
      </div>
      <div className="summary-card">
        <div className="label">Weekly Losers</div>
        <div className="value" style={{ color: 'var(--red)' }}>{summary.losers}</div>
        <div className="sub" style={{ color: 'var(--red)' }}>products down WoW</div>
      </div>
      <div className="summary-card">
        <div className="label">Avg Weekly Change</div>
        <div className="value"><PctChange value={summary.avgWow} /></div>
        <div className="sub" style={{ color: 'var(--text-secondary)' }}>across filtered products</div>
      </div>
    </div>
  );
}

export default function SectorDashboard() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => (
    activeFilter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter)
  ), [activeFilter]);

  const refDateLabel = useMemo(() => {
    const d = new Date(REFERENCE_DATE + 'T00:00:00');
    return `As of ${d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
  }, []);

  return (
    <div className="sector-dashboard">
      <style>{CSS}</style>
      <TVTickerTape />
      <div className="header">
        <h1><span className="icon">&#9951;</span> Oil &amp; Energy KPI Tracker</h1>
        <div className="header-meta">
          <span className="date">{refDateLabel}</span>
        </div>
      </div>
      <div className="filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${cat === activeFilter ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <SummaryCards filtered={filtered} />
      <div className="container">
        <h2 className="section-title">Product Performance</h2>
        <div className="table-wrap">
          <table className="kpi-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="right">Current Price</th>
                <th className="right">vs Week Ago</th>
                <th className="right">MTD</th>
                <th className="right">YTD</th>
                <th>30D Trend</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => <ProductRow key={p.id} product={p} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.sector-dashboard {
  --bg-primary: #0f1923;
  --bg-secondary: #1a2733;
  --bg-card: #1e2d3d;
  --border: #2a3f52;
  --text-primary: #e8edf2;
  --text-secondary: #8899aa;
  --accent: #3b82f6;
  --green: #10b981;
  --red: #ef4444;
  --yellow: #f59e0b;
  --green-bg: rgba(16, 185, 129, 0.1);
  --red-bg: rgba(239, 68, 68, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
}
.sector-dashboard *, .sector-dashboard *::before, .sector-dashboard *::after { box-sizing: border-box; }
.sector-dashboard button { font-family: inherit; }

.sector-dashboard .tv-ticker-tape {
  width: 100%;
  height: 46px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}

.sector-dashboard .header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sector-dashboard .header h1 {
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}
.sector-dashboard .header h1 .icon { font-size: 26px; }
.sector-dashboard .header-meta { display: flex; gap: 24px; align-items: center; }
.sector-dashboard .header-meta .date { color: var(--text-secondary); font-size: 14px; }

.sector-dashboard .filter-bar {
  background: var(--bg-secondary);
  padding: 12px 32px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
}
.sector-dashboard .filter-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.sector-dashboard .filter-btn:hover { border-color: var(--accent); color: var(--text-primary); }
.sector-dashboard .filter-btn.active { background: var(--accent); border-color: var(--accent); color: white; }

.sector-dashboard .summary-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  padding: 24px 32px;
}
.sector-dashboard .summary-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 20px;
}
.sector-dashboard .summary-card .label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.sector-dashboard .summary-card .value { font-size: 26px; font-weight: 700; }
.sector-dashboard .summary-card .sub { font-size: 13px; margin-top: 4px; }

.sector-dashboard .container { padding: 0 32px 32px; }
.sector-dashboard .section-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; }

.sector-dashboard .table-wrap { overflow-x: auto; }
.sector-dashboard .kpi-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.sector-dashboard .kpi-table thead th {
  background: var(--bg-secondary);
  padding: 14px 16px;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.sector-dashboard .kpi-table thead th.right { text-align: right; }
.sector-dashboard .kpi-table tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
.sector-dashboard .kpi-table tbody tr:last-child { border-bottom: none; }
.sector-dashboard .kpi-table tbody tr:hover { background: rgba(59, 130, 246, 0.05); }
.sector-dashboard .kpi-table td { padding: 14px 16px; font-size: 14px; }
.sector-dashboard .kpi-table td.right { text-align: right; font-variant-numeric: tabular-nums; }

.sector-dashboard .product-cell { display: flex; flex-direction: column; gap: 2px; }
.sector-dashboard .product-name { font-weight: 600; }
.sector-dashboard .product-category { font-size: 12px; color: var(--text-secondary); }

.sector-dashboard .price { font-weight: 600; font-size: 15px; }
.sector-dashboard .unit { font-size: 11px; color: var(--text-secondary); margin-left: 2px; }

.sector-dashboard .change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
}
.sector-dashboard .change.up { color: var(--green); background: var(--green-bg); }
.sector-dashboard .change.down { color: var(--red); background: var(--red-bg); }
.sector-dashboard .change.flat { color: var(--text-secondary); background: rgba(136, 153, 170, 0.1); }
.sector-dashboard .arrow { font-size: 11px; }

.sector-dashboard .sparkline-cell { width: 120px; }
.sector-dashboard .sparkline { width: 110px; height: 32px; }

.sector-dashboard .product-row { cursor: pointer; }
.sector-dashboard .product-row:hover { background: rgba(59, 130, 246, 0.08) !important; }

.sector-dashboard .expand-icon {
  display: inline-block;
  width: 16px;
  font-size: 10px;
  color: var(--text-secondary);
  transition: transform 0.2s;
  margin-right: 6px;
}
.sector-dashboard .expand-icon.open { transform: rotate(90deg); }

.sector-dashboard .securities-row td { padding: 0 !important; background: var(--bg-secondary); }
.sector-dashboard .securities-panel { overflow: hidden; }
.sector-dashboard .securities-inner { padding: 16px 20px 20px; }
.sector-dashboard .securities-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.sector-dashboard .securities-header h4 { font-size: 13px; font-weight: 600; margin: 0; }
.sector-dashboard .securities-legend { display: flex; gap: 12px; font-size: 11px; }
.sector-dashboard .legend-item { display: flex; align-items: center; gap: 4px; color: var(--text-secondary); }
.sector-dashboard .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.sector-dashboard .legend-dot.stock { background: var(--accent); }
.sector-dashboard .legend-dot.etf { background: var(--yellow); }

.sector-dashboard .tv-symbols-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}
.sector-dashboard .tv-symbol-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: border-color 0.15s;
}
.sector-dashboard .tv-symbol-card .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}
.sector-dashboard .security-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 22px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}
.sector-dashboard .security-badge.stock { background: rgba(59, 130, 246, 0.15); color: var(--accent); }
.sector-dashboard .security-badge.etf   { background: rgba(245, 158, 11, 0.15); color: var(--yellow); }

.sector-dashboard .card-ticker { font-weight: 700; font-size: 14px; }
.sector-dashboard .card-name { font-size: 12px; color: var(--text-secondary); }
.sector-dashboard .card-exposure {
  font-size: 11px;
  color: var(--text-secondary);
  opacity: 0.7;
  margin-left: auto;
  max-width: 180px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sector-dashboard .tv-widget-container { height: 180px; width: 100%; }

.sector-dashboard .tv-detail-section {
  margin-top: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.sector-dashboard .tv-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
}
.sector-dashboard .tv-detail-header span { font-size: 13px; font-weight: 600; }
.sector-dashboard .tv-detail-tabs { display: flex; gap: 4px; }
.sector-dashboard .tv-detail-tab {
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}
.sector-dashboard .tv-detail-tab.active { background: var(--accent); border-color: var(--accent); color: white; }
.sector-dashboard .tv-detail-tab:hover { border-color: var(--accent); }
.sector-dashboard .tv-detail-chart { height: 400px; width: 100%; }

.sector-dashboard .tv-source-note {
  text-align: right;
  padding: 8px 0 0;
  font-size: 11px;
  color: var(--text-secondary);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .sector-dashboard .header { padding: 16px; }
  .sector-dashboard .summary-row { padding: 16px; }
  .sector-dashboard .container { padding: 0 16px 16px; }
  .sector-dashboard .filter-bar { padding: 10px 16px; }
  .sector-dashboard .kpi-table { font-size: 13px; }
  .sector-dashboard .kpi-table td, .sector-dashboard .kpi-table th { padding: 10px 8px; }
  .sector-dashboard .sparkline-cell { display: none; }
  .sector-dashboard .tv-symbols-grid { grid-template-columns: 1fr; }
}
`;
