const chargingStations = [
  // Colombo Area
  {
    id: 'station1',
    latitude: 6.9271,
    longitude: 79.8612,
    title: 'Colombo City Center',
    description: 'Fast Charging Station',
    address: '123 Galle Road, Colombo 03',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },
  {
    id: 'station2',
    latitude: 6.9150,
    longitude: 79.8630,
    title: 'One Galle Face Mall',
    description: 'Level 2 Chargers',
    address: '1A, Centre Road, Colombo 01',
    type: 'CCS2',
    power: '50 kW (DC)'
  },
  {
    id: 'station3',
    latitude: 6.9300,
    longitude: 79.8700,
    title: 'Arcade Independence Square',
    description: 'Dual-port Charging',
    address: 'Independence Avenue, Colombo 07',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },
  {
    id: 'station4',
    latitude: 6.9025,
    longitude: 79.8607,
    title: 'Liberty Plaza',
    description: 'Shopping Center Chargers',
    address: 'R. A. De Mel Mawatha, Colombo 03',
    type: 'CHAdeMO',
    power: '50 kW (DC)'
  },

  // Kandy Area
  {
    id: 'station5',
    latitude: 7.2906,
    longitude: 80.6337,
    title: 'Kandy City Center',
    description: 'Central Charging Hub',
    address: 'Dalada Veediya, Kandy',
    type: 'Type 2 (Mennekes)',
    power: '7.4 kW (AC)'
  },
  {
    id: 'station6',
    latitude: 7.2962,
    longitude: 80.6350,
    title: 'Kandy Municipal Parking',
    description: '24/7 Charging Available',
    address: 'William Gopallawa Mawatha, Kandy',
    type: 'CCS2',
    power: '120 kW (DC)'
  },

  // Galle Area
  {
    id: 'station7',
    latitude: 6.0535,
    longitude: 80.2110,
    title: 'Galle Fort Charging',
    description: 'Historic Location Chargers',
    address: 'Church Street, Galle Fort',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },
  {
    id: 'station8',
    latitude: 6.0329,
    longitude: 80.2158,
    title: 'Unawatuna Beach Station',
    description: 'Beachside Charging',
    address: 'Matara Road, Unawatuna',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },

  // Negombo Area
  {
    id: 'station9',
    latitude: 7.2098,
    longitude: 79.8381,
    title: 'Negombo Beach Park',
    description: 'Coastal Charging Point',
    address: 'Poruthota Road, Negombo',
    type: 'CCS2',
    power: '60 kW (DC)'
  },

  // Jaffna Area
  {
    id: 'station10',
    latitude: 9.6615,
    longitude: 80.0255,
    title: 'Jaffna Public Library',
    description: 'Northern Province Charging',
    address: 'Esplanade Road, Jaffna',
    type: 'Type 2 (Mennekes)',
    power: '7.4 kW (AC)'
  },

  // Trincomalee Area
  {
    id: 'station11',
    latitude: 8.5692,
    longitude: 81.2329,
    title: 'Trinco Beach Charging',
    description: 'East Coast Charging',
    address: 'Nilaveli Road, Trincomalee',
    type: 'CHAdeMO',
    power: '50 kW (DC)'
  },

  // Nuwara Eliya Area
  {
    id: 'station12',
    latitude: 6.9707,
    longitude: 80.7829,
    title: 'Gregory Lake Station',
    description: 'Hill Country Charging',
    address: 'Lake Road, Nuwara Eliya',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },

  // Anuradhapura Area
  {
    id: 'station13',
    latitude: 8.3356,
    longitude: 80.3888,
    title: 'Sacred City Charging',
    description: 'Cultural Triangle Charger',
    address: 'Old Puttalam Road, Anuradhapura',
    type: 'CCS2',
    power: '100 kW (DC)'
  },

  // Hambantota Area
  {
    id: 'station14',
    latitude: 6.1249,
    longitude: 81.1188,
    title: 'Hambantota Port Charging',
    description: 'Southern Development Hub',
    address: 'Hambantota Port Access Road',
    type: 'CCS2',
    power: '150 kW (DC)'
  },

  // Ratnapura Area
  {
    id: 'station15',
    latitude: 6.6808,
    longitude: 80.4039,
    title: 'Gem City Charging',
    description: 'Gem Mining Region Station',
    address: 'Colombo Road, Ratnapura',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },

  // Additional Colombo Suburbs
  {
    id: 'station16',
    latitude: 6.8417,
    longitude: 79.8696,
    title: 'Battaramulla Charging Hub',
    description: 'Government District Charging',
    address: 'Parliment Road, Battaramulla',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },
  {
    id: 'station17',
    latitude: 6.8733,
    longitude: 79.8868,
    title: 'Kotte City Charging',
    description: 'Sri Jayawardenepura Station',
    address: 'High Level Road, Kotte',
    type: 'CCS2',
    power: '60 kW (DC)'
  },

  // Airport Area
  {
    id: 'station18',
    latitude: 7.1805,
    longitude: 79.8841,
    title: 'BIA Airport Charging',
    description: 'International Airport Station',
    address: 'Bandaranaike International Airport, Katunayake',
    type: 'CCS2',
    power: '120 kW (DC)'
  },

  // Southern Highway Stops
  {
    id: 'station19',
    latitude: 6.8106,
    longitude: 80.0602,
    title: 'Pinnaduwa Highway Charging',
    description: 'Southern Expressway Station',
    address: 'Southern Expressway, Pinnaduwa Exit',
    type: 'CCS2',
    power: '150 kW (DC)'
  },
  {
    id: 'station20',
    latitude: 6.1439,
    longitude: 80.1086,
    title: 'Matara City Charging',
    description: 'Southern Terminal Station',
    address: 'Station Road, Matara',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },
   {
    id: 'station21',
    latitude: 7.2784,
    longitude: 80.5874,
    title: 'Peradeniya University Station',
    description: 'Campus Charging Hub',
    address: 'University of Peradeniya, Peradeniya',
    type: 'Type 2 (Mennekes)',
    power: '7.4 kW (AC)'
  },
  {
    id: 'station22',
    latitude: 7.2525,
    longitude: 80.5986,
    title: 'Gampola Town Center',
    description: 'Municipal Charging Point',
    address: 'Kandy Road, Gampola',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },

  // Eastern Province
  {
    id: 'station23',
    latitude: 7.7058,
    longitude: 81.6797,
    title: 'Batticaloa Lagoon View',
    description: 'Coastal Charging Station',
    address: 'Lagoon Road, Batticaloa',
    type: 'CHAdeMO',
    power: '50 kW (DC)'
  },
  {
    id: 'station24',
    latitude: 8.7560,
    longitude: 81.2169,
    title: 'Kinniya Bridge Station',
    description: 'Eastern Highway Charging',
    address: 'A15 Highway, Kinniya',
    type: 'CCS2',
    power: '60 kW (DC)'
  },

  // Uva Province
  {
    id: 'station25',
    latitude: 6.9895,
    longitude: 81.0557,
    title: 'Badulla City Center',
    description: 'Uva Province Main Station',
    address: 'Bandaranayake Street, Badulla',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },
  {
    id: 'station26',
    latitude: 6.8411,
    longitude: 81.0132,
    title: 'Haputale View Point',
    description: 'Hill Country Charging',
    address: 'Haputale Passara Road',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },

  // Sabaragamuwa Province
  {
    id: 'station27',
    latitude: 6.7153,
    longitude: 80.3846,
    title: 'Balangoda Town Charging',
    description: 'Hill Country Station',
    address: 'Colombo Road, Balangoda',
    type: 'Type 2 (Mennekes)',
    power: '7.4 kW (AC)'
  },
  {
    id: 'station28',
    latitude: 6.5866,
    longitude: 80.6783,
    title: 'Kalawana Junction',
    description: 'Sinharaja Access Point',
    address: 'Ratnapura-Kalawana Road',
    type: 'Type 2 (Mennekes)',
    power: '7.4 kW (AC)'
  },

  // Northern Province
  {
    id: 'station29',
    latitude: 9.3801,
    longitude: 80.4170,
    title: 'Kilinochchi Central',
    description: 'Northern Rebuilding Hub',
    address: 'A9 Highway, Kilinochchi',
    type: 'CCS2',
    power: '60 kW (DC)'
  },
  {
    id: 'station30',
    latitude: 8.9606,
    longitude: 80.0153,
    title: 'Vavuniya Transit Hub',
    description: 'North-South Junction',
    address: 'Kandy Road, Vavuniya',
    type: 'CHAdeMO',
    power: '50 kW (DC)'
  },

  // Northwestern Province
  {
    id: 'station31',
    latitude: 7.6736,
    longitude: 80.2536,
    title: 'Kurunegala City Charging',
    description: 'Wayamba Province Main',
    address: 'Colombo Road, Kurunegala',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },
  {
    id: 'station32',
    latitude: 7.9556,
    longitude: 80.0153,
    title: 'Puttalam Salt Plains',
    description: 'Coastal Charging Point',
    address: 'Puttalam-Mannar Road',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },

  // Southern Province (additional)
  {
    id: 'station33',
    latitude: 6.1246,
    longitude: 80.1036,
    title: 'Weligama Bay Charging',
    description: 'Surfing Beach Station',
    address: 'Matara Road, Weligama',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },
  {
    id: 'station34',
    latitude: 6.0129,
    longitude: 80.2175,
    title: 'Mirissa Harbor Point',
    description: 'Whale Watching Hub',
    address: 'Harbor Road, Mirissa',
    type: 'CCS2',
    power: '100 kW (DC)'
  },

  // Central Highlands
  {
    id: 'station35',
    latitude: 6.8114,
    longitude: 80.8042,
    title: 'Ella Gap View',
    description: 'Scenic Charging Station',
    address: 'Passara Road, Ella',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },
  {
    id: 'station36',
    latitude: 6.8787,
    longitude: 80.6186,
    title: 'Nanuoya Railway Station',
    description: 'Hill Country Train Hub',
    address: 'Nanuoya Town Center',
    type: 'Type 2 (Mennekes)',
    power: '7.4 kW (AC)'
  },

  // Off-the-Beaten Path
  {
    id: 'station37',
    latitude: 7.4708,
    longitude: 80.3585,
    title: 'Dambulla Cave Temple',
    description: 'Cultural Heritage Charging',
    address: 'Kandy-Anuradhapura Road',
    type: 'CHAdeMO',
    power: '50 kW (DC)'
  },
  {
    id: 'station38',
    latitude: 6.4333,
    longitude: 81.0667,
    title: 'Yala Safari Gate',
    description: 'Wildlife Park Charging',
    address: 'Yala National Park Entrance',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },

  // Highway Network
  {
    id: 'station39',
    latitude: 7.2156,
    longitude: 79.9417,
    title: 'Katunayake Expressway Hub',
    description: 'E01 Highway Charging',
    address: 'Colombo-Katunayake Expressway',
    type: 'CCS2',
    power: '150 kW (DC)'
  },
  {
    id: 'station40',
    latitude: 7.1204,
    longitude: 80.0123,
    title: 'Kadawatha Junction',
    description: 'Outer Circular Charging',
    address: 'Outer Circular Road',
    type: 'CCS2',
    power: '120 kW (DC)'
  },

  // Emerging Cities
  {
    id: 'station41',
    latitude: 6.9849,
    longitude: 79.9731,
    title: 'Homagama Tech Park',
    description: 'Emerging Tech Hub',
    address: 'High Level Road, Homagama',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },
  {
    id: 'station42',
    latitude: 7.1124,
    longitude: 79.8532,
    title: 'Negombo Fish Market',
    description: 'Fishing Port Charging',
    address: 'Lewis Place, Negombo',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },

  // Religious Sites
  {
    id: 'station43',
    latitude: 7.7569,
    longitude: 80.2021,
    title: 'Maho Bodhi Temple',
    description: 'Pilgrimage Charging',
    address: 'Anuradhapura Road, Maho',
    type: 'Type 2 (Mennekes)',
    power: '7.4 kW (AC)'
  },
  {
    id: 'station44',
    latitude: 7.6856,
    longitude: 80.4036,
    title: 'Dambulla Golden Temple',
    description: 'World Heritage Charging',
    address: 'Kandy Road, Dambulla',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },

  // Plantation Areas
  {
    id: 'station45',
    latitude: 6.7806,
    longitude: 80.8936,
    title: 'Haputale Tea Factory',
    description: 'Plantation Charging',
    address: 'Diyatalawa Road, Haputale',
    type: 'Type 2 (Mennekes)',
    power: '7.4 kW (AC)'
  },
  {
    id: 'station46',
    latitude: 6.8936,
    longitude: 80.5647,
    title: 'Nuwara Eliya Golf Club',
    description: 'Hill Station Charging',
    address: 'Golf Course Road, Nuwara Eliya',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  },

  // Coastal Areas
  {
    id: 'station47',
    latitude: 6.0546,
    longitude: 80.2115,
    title: 'Galle Lighthouse',
    description: 'Historic Coastal Charging',
    address: 'Galle Fort Ramparts',
    type: 'CCS2',
    power: '100 kW (DC)'
  },
  {
    id: 'station48',
    latitude: 6.8239,
    longitude: 79.8865,
    title: 'Mount Lavinia Beach',
    description: 'Urban Beach Charging',
    address: 'Hotel Road, Mount Lavinia',
    type: 'Type 2 (Mennekes)',
    power: '22 kW (AC)'
  },

  // Border Towns
  {
    id: 'station49',
    latitude: 9.5213,
    longitude: 80.3925,
    title: 'Elephant Pass Junction',
    description: 'Northern Gateway',
    address: 'A9 Highway, Elephant Pass',
    type: 'CHAdeMO',
    power: '50 kW (DC)'
  },
  {
    id: 'station50',
    latitude: 6.8233,
    longitude: 80.0419,
    title: 'Avissawella Town Center',
    description: 'Western Border Charging',
    address: 'Colombo Road, Avissawella',
    type: 'Type 2 (Mennekes)',
    power: '11 kW (AC)'
  }
];

export default chargingStations;