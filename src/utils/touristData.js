// Tourist spots data for India with coordinates and metadata
export const touristSpots = [
  // Western India
  { 
    id: 1, 
    name: "Gateway of India", 
    coords: [72.8347, 18.9220], 
    region: "west", 
    category: "monument",
    description: "Historic arch monument in Mumbai",
    rating: 4.5
  },
  { 
    id: 2, 
    name: "Hawa Mahal", 
    coords: [75.8267, 26.9239], 
    region: "west", 
    category: "palace",
    description: "Palace of Winds in Jaipur",
    rating: 4.3
  },
  { 
    id: 3, 
    name: "Statue of Unity", 
    coords: [73.7190, 21.8380], 
    region: "west", 
    category: "monument",
    description: "World's tallest statue of Sardar Patel",
    rating: 4.4
  },
  { 
    id: 4, 
    name: "Taj Mahal", 
    coords: [78.0421, 27.1751], 
    region: "west", 
    category: "monument",
    description: "Iconic white marble mausoleum",
    rating: 4.8
  },
  { 
    id: 5, 
    name: "Red Fort", 
    coords: [77.2410, 28.6562], 
    region: "west", 
    category: "fort",
    description: "Historic fort in Delhi",
    rating: 4.2
  },
  { 
    id: 6, 
    name: "Amber Fort", 
    coords: [75.8513, 26.9855], 
    region: "west", 
    category: "fort",
    description: "Magnificent fort in Jaipur",
    rating: 4.6
  },
  { 
    id: 7, 
    name: "Udaipur City Palace", 
    coords: [73.6800, 24.5760], 
    region: "west", 
    category: "palace",
    description: "Royal palace complex in Udaipur",
    rating: 4.5
  },
  { 
    id: 8, 
    name: "Jaisalmer Fort", 
    coords: [70.9147, 26.9157], 
    region: "west", 
    category: "fort",
    description: "Golden fort in the Thar Desert",
    rating: 4.4
  },
  { 
    id: 9, 
    name: "Ajanta Caves", 
    coords: [75.7000, 20.5500], 
    region: "west", 
    category: "cave",
    description: "Ancient Buddhist cave monuments",
    rating: 4.7
  },
  { 
    id: 10, 
    name: "Ellora Caves", 
    coords: [75.1833, 20.0167], 
    region: "west", 
    category: "cave",
    description: "Rock-cut cave temples",
    rating: 4.6
  },

  // Eastern India
  { 
    id: 11, 
    name: "Victoria Memorial", 
    coords: [88.3426, 22.5448], 
    region: "east", 
    category: "memorial",
    description: "Marble memorial in Kolkata",
    rating: 4.3
  },
  { 
    id: 12, 
    name: "Darjeeling Tea Gardens", 
    coords: [88.2636, 27.0360], 
    region: "east", 
    category: "nature",
    description: "Famous tea plantations",
    rating: 4.5
  },
  { 
    id: 13, 
    name: "Sundarbans National Park", 
    coords: [88.8833, 21.7333], 
    region: "east", 
    category: "nature",
    description: "Mangrove forest and tiger reserve",
    rating: 4.4
  },
  { 
    id: 14, 
    name: "Konark Sun Temple", 
    coords: [86.0944, 19.8876], 
    region: "east", 
    category: "temple",
    description: "Ancient sun temple in Odisha",
    rating: 4.6
  },
  { 
    id: 15, 
    name: "Bodh Gaya", 
    coords: [84.9911, 24.6961], 
    region: "east", 
    category: "temple",
    description: "Sacred Buddhist pilgrimage site",
    rating: 4.7
  },
  { 
    id: 16, 
    name: "Kaziranga National Park", 
    coords: [93.4167, 26.6667], 
    region: "east", 
    category: "nature",
    description: "Home to the one-horned rhinoceros",
    rating: 4.8
  },
  { 
    id: 17, 
    name: "Mahabodhi Temple", 
    coords: [84.9911, 24.6961], 
    region: "east", 
    category: "temple",
    description: "UNESCO World Heritage Buddhist temple",
    rating: 4.6
  },
  { 
    id: 18, 
    name: "Puri Jagannath Temple", 
    coords: [85.8333, 19.8000], 
    region: "east", 
    category: "temple",
    description: "Famous Hindu temple in Odisha",
    rating: 4.5
  },
  { 
    id: 19, 
    name: "Gangtok", 
    coords: [88.6122, 27.3314], 
    region: "east", 
    category: "city",
    description: "Capital of Sikkim with mountain views",
    rating: 4.3
  },
  { 
    id: 20, 
    name: "Shillong", 
    coords: [91.8833, 25.5667], 
    region: "east", 
    category: "city",
    description: "Scotland of the East",
    rating: 4.2
  },

  // Meghalaya specific tourist spots
  { 
    id: 31, 
    name: "Cherrapunji", 
    coords: [91.7167, 25.3000], 
    region: "meghalaya", 
    category: "nature",
    description: "Wettest place on Earth with living root bridges",
    rating: 4.6
  },
  { 
    id: 32, 
    name: "Mawsynram", 
    coords: [91.5833, 25.3000], 
    region: "meghalaya", 
    category: "nature",
    description: "Village with highest annual rainfall",
    rating: 4.4
  },
  { 
    id: 33, 
    name: "Dawki", 
    coords: [92.0167, 25.1833], 
    region: "meghalaya", 
    category: "nature",
    description: "Crystal clear river and border town",
    rating: 4.5
  },
  { 
    id: 34, 
    name: "Nongriat Living Root Bridge", 
    coords: [91.7167, 25.2500], 
    region: "meghalaya", 
    category: "nature",
    description: "Natural bridge made from living tree roots",
    rating: 4.7
  },
  { 
    id: 35, 
    name: "Elephant Falls", 
    coords: [91.8833, 25.5500], 
    region: "meghalaya", 
    category: "nature",
    description: "Three-tiered waterfall near Shillong",
    rating: 4.3
  },
  { 
    id: 36, 
    name: "Mawlynnong Village", 
    coords: [91.9167, 25.2000], 
    region: "meghalaya", 
    category: "village",
    description: "Cleanest village in Asia",
    rating: 4.5
  },
  { 
    id: 37, 
    name: "Krem Liat Prah Cave", 
    coords: [91.8000, 25.4000], 
    region: "meghalaya", 
    category: "cave",
    description: "Longest cave system in India",
    rating: 4.4
  },
  { 
    id: 38, 
    name: "Balpakram National Park", 
    coords: [90.8333, 25.5000], 
    region: "meghalaya", 
    category: "nature",
    description: "National park with diverse wildlife",
    rating: 4.2
  },
  { 
    id: 39, 
    name: "Nohkalikai Falls", 
    coords: [91.7167, 25.2667], 
    region: "meghalaya", 
    category: "nature",
    description: "Tallest plunge waterfall in India",
    rating: 4.6
  },
  { 
    id: 40, 
    name: "Umiam Lake", 
    coords: [91.8000, 25.6667], 
    region: "meghalaya", 
    category: "nature",
    description: "Artificial lake with water sports",
    rating: 4.1
  },

  // Northern India
  { 
    id: 21, 
    name: "Golden Temple", 
    coords: [74.8765, 31.6200], 
    region: "north", 
    category: "temple",
    description: "Sacred Sikh gurdwara in Amritsar",
    rating: 4.8
  },
  { 
    id: 22, 
    name: "Leh Palace", 
    coords: [77.5833, 34.1667], 
    region: "north", 
    category: "palace",
    description: "Historic palace in Ladakh",
    rating: 4.4
  },
  { 
    id: 23, 
    name: "Dal Lake", 
    coords: [74.8667, 34.1167], 
    region: "north", 
    category: "nature",
    description: "Famous lake in Srinagar",
    rating: 4.5
  },
  { 
    id: 24, 
    name: "Rishikesh", 
    coords: [78.2667, 30.0833], 
    region: "north", 
    category: "city",
    description: "Yoga capital of the world",
    rating: 4.3
  },
  { 
    id: 25, 
    name: "Manali", 
    coords: [77.1833, 32.2500], 
    region: "north", 
    category: "city",
    description: "Hill station in Himachal Pradesh",
    rating: 4.4
  },

  // Southern India
  { 
    id: 26, 
    name: "Mysore Palace", 
    coords: [76.6536, 12.3052], 
    region: "south", 
    category: "palace",
    description: "Royal palace in Karnataka",
    rating: 4.6
  },
  { 
    id: 27, 
    name: "Hampi", 
    coords: [76.4600, 15.3350], 
    region: "south", 
    category: "ruins",
    description: "Ancient city ruins in Karnataka",
    rating: 4.7
  },
  { 
    id: 28, 
    name: "Meenakshi Temple", 
    coords: [78.1197, 9.9197], 
    region: "south", 
    category: "temple",
    description: "Famous temple in Madurai",
    rating: 4.5
  },
  { 
    id: 29, 
    name: "Kerala Backwaters", 
    coords: [76.2500, 9.5000], 
    region: "south", 
    category: "nature",
    description: "Network of canals and lagoons",
    rating: 4.6
  },
  { 
    id: 30, 
    name: "Goa Beaches", 
    coords: [73.8278, 15.2993], 
    region: "south", 
    category: "beach",
    description: "Famous beaches and nightlife",
    rating: 4.4
  }
];

// Category colors for markers
export const categoryColors = {
  monument: '#e74c3c',
  palace: '#9b59b6',
  fort: '#f39c12',
  temple: '#27ae60',
  nature: '#2ecc71',
  beach: '#3498db',
  city: '#34495e',
  cave: '#8e44ad',
  memorial: '#e67e22',
  ruins: '#95a5a6'
};

// Region colors
export const regionColors = {
  north: '#3498db',
  south: '#e74c3c',
  east: '#27ae60',
  west: '#f39c12',
  meghalaya: '#8e44ad'
};

// Meghalaya specific tourist spots
export const meghalayaTouristSpots = [
  { 
    id: 31, 
    name: "Cherrapunji", 
    coords: [91.7167, 25.3000], 
    region: "meghalaya", 
    category: "nature",
    description: "Wettest place on Earth with living root bridges",
    rating: 4.6
  },
  { 
    id: 32, 
    name: "Mawsynram", 
    coords: [91.5833, 25.3000], 
    region: "meghalaya", 
    category: "nature",
    description: "Village with highest annual rainfall",
    rating: 4.4
  },
  { 
    id: 33, 
    name: "Dawki", 
    coords: [92.0167, 25.1833], 
    region: "meghalaya", 
    category: "nature",
    description: "Crystal clear river and border town",
    rating: 4.5
  },
  { 
    id: 34, 
    name: "Nongriat Living Root Bridge", 
    coords: [91.7167, 25.2500], 
    region: "meghalaya", 
    category: "nature",
    description: "Natural bridge made from living tree roots",
    rating: 4.7
  },
  { 
    id: 35, 
    name: "Elephant Falls", 
    coords: [91.8833, 25.5500], 
    region: "meghalaya", 
    category: "nature",
    description: "Three-tiered waterfall near Shillong",
    rating: 4.3
  },
  { 
    id: 36, 
    name: "Mawlynnong Village", 
    coords: [91.9167, 25.2000], 
    region: "meghalaya", 
    category: "village",
    description: "Cleanest village in Asia",
    rating: 4.5
  },
  { 
    id: 37, 
    name: "Krem Liat Prah Cave", 
    coords: [91.8000, 25.4000], 
    region: "meghalaya", 
    category: "cave",
    description: "Longest cave system in India",
    rating: 4.4
  },
  { 
    id: 38, 
    name: "Balpakram National Park", 
    coords: [90.8333, 25.5000], 
    region: "meghalaya", 
    category: "nature",
    description: "National park with diverse wildlife",
    rating: 4.2
  },
  { 
    id: 39, 
    name: "Nohkalikai Falls", 
    coords: [91.7167, 25.2667], 
    region: "meghalaya", 
    category: "nature",
    description: "Tallest plunge waterfall in India",
    rating: 4.6
  },
  { 
    id: 40, 
    name: "Umiam Lake", 
    coords: [91.8000, 25.6667], 
    region: "meghalaya", 
    category: "nature",
    description: "Artificial lake with water sports",
    rating: 4.1
  }
];
