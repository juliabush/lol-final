/**
 * Mapping from platform IDs to display names (user readable)
 */

export const READABLE_REGIONS = ['NA', 'BR', 'LAN', 'LAS', 'KR', 'JP', 'EUW', 'EUNE', 'TR', 'RU', 'OCE', 'SEA', 'TW', 'VN', 'ME']

export const SUMMONER_TO_READABLE = {
  'NA1': 'NA',
  'BR1': 'BR',
  'LA1': 'LAN',
  'LA2': 'LAS',
  'KR': 'KR',
  'JP1': 'JP',
  'EUW1': 'EUW',
  'EUN1': 'EUNE',
  'TR1': 'TR',
  'RU': 'RU',
  'OC1': 'OCE',
  'PH2': 'SEA',
  'SG2': 'SEA',
  'TH2': 'SEA',
  'TW2': 'TW',
  'VN2': 'VN',
  'ME1': 'ME'
};

export const SUMMONER_TO_ROUTING = {
    'NA1': 'americas',
    'BR1': 'americas',
    'LA1': 'americas',
    'LA2': 'americas',
    'KR': 'asia',
    'JP1': 'asia',
    'EUW1': 'europe',
    'EUN1': 'europe',
    'TR1': 'europe',
    'RU': 'europe',
    'OC1': 'sea',
    'PH2': 'sea',
    'SG2': 'sea',
    'TH2': 'sea',
    'TW2': 'sea',
    'VN2': 'sea',
    'ME1': 'sea'
};