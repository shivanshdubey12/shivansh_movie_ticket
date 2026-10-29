// Sample mock data for seeding

const getDates = () => {
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const dates = getDates();

const movies = [
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 166,
    releaseDate: new Date('2024-03-01'),
    rating: 8.6,
    certificate: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    status: 'now_showing'
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral and political dilemmas of creating the weapon of ultimate destruction.',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: new Date('2023-07-21'),
    rating: 8.9,
    certificate: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    status: 'now_showing'
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    language: 'English',
    duration: 140,
    releaseDate: new Date('2023-06-02'),
    rating: 8.7,
    certificate: 'U',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    status: 'now_showing'
  },
  {
    title: 'Deadpool & Wolverine',
    description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy in a high-octane multiversal rampage filled with irreverent humor and blockbuster spectacle.',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    language: 'English',
    duration: 128,
    releaseDate: new Date('2024-07-26'),
    rating: 8.0,
    certificate: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
    status: 'now_showing'
  },
  {
    title: 'Interstellar: 10th Anniversary IMAX',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    releaseDate: new Date('2024-09-27'),
    rating: 8.7,
    certificate: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    status: 'now_showing'
  },
  {
    title: 'Avatar: Fire and Ash',
    description: 'Jake Sully and Neytiri encounter a mysterious, aggressive volcanic tribe of Na\'vi known as the Ash People on Pandora, testing their family bond and planet loyalty.',
    genre: ['Sci-Fi', 'Action', 'Fantasy'],
    language: 'English',
    duration: 190,
    releaseDate: new Date('2025-12-19'),
    rating: 8.5,
    certificate: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: '',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    status: 'upcoming'
  }
];

const theatres = [
  {
    name: 'PVR ICON: Infiniti Mall',
    city: 'Mumbai',
    location: 'Andheri West',
    address: 'Infiniti Mall, Link Road, Andheri West, Mumbai, Maharashtra 400053',
    facilities: ['Dolby Atmos', 'Recliner Seats', 'Gourmet Food', 'Valet Parking', '4DX'],
    screens: [
      { screenNumber: 1, name: 'Audi 1 - IMAX', seatingCapacity: 60, soundSystem: 'Dolby Atmos', formats: ['IMAX 2D', 'IMAX 3D'] },
      { screenNumber: 2, name: 'Audi 2 - Gold Class', seatingCapacity: 60, soundSystem: 'Dolby 7.1', formats: ['2D', '3D'] }
    ]
  },
  {
    name: 'INOX Megaplex: Inorbit Mall',
    city: 'Mumbai',
    location: 'Malad West',
    address: 'Inorbit Mall, New Link Rd, Malad West, Mumbai, Maharashtra 400064',
    facilities: ['IMAX', 'Insignia Lounge', 'Dolby Atmos', 'Cafe Unwind'],
    screens: [
      { screenNumber: 1, name: 'Screen 1', seatingCapacity: 60, soundSystem: 'Dolby Atmos', formats: ['2D', '3D', 'IMAX 3D'] }
    ]
  },
  {
    name: 'PVR Director’s Cut: Ambience Mall',
    city: 'Delhi',
    location: 'Vasant Kunj',
    address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi 110070',
    facilities: ['Luxury Recliners', 'Concierge Dining', 'Dolby Atmos', 'Wine Bar'],
    screens: [
      { screenNumber: 1, name: 'Screen 1 Platinum', seatingCapacity: 60, soundSystem: 'Dolby Atmos', formats: ['2D', '3D'] }
    ]
  },
  {
    name: 'Cinepolis: DLF Avenue',
    city: 'Delhi',
    location: 'Saket',
    address: 'DLF Avenue, Press Enclave Marg, Saket District Centre, New Delhi 110017',
    facilities: ['4DX', 'Macro XE', 'Dolby Atmos', 'Food Court'],
    screens: [
      { screenNumber: 1, name: 'Screen 1 Macro XE', seatingCapacity: 60, soundSystem: 'Dolby Atmos', formats: ['2D', '3D'] }
    ]
  },
  {
    name: 'PVR Orion Mall: Brigade Gateway',
    city: 'Bengaluru',
    location: 'Rajajinagar',
    address: 'Orion Mall, Brigade Gateway, 26/1 Dr. Rajkumar Road, Bengaluru 560055',
    facilities: ['IMAX', 'PVR P[XL]', 'Dolby Atmos', 'Cafe'],
    screens: [
      { screenNumber: 1, name: 'Audi 1 IMAX', seatingCapacity: 60, soundSystem: 'Dolby Atmos', formats: ['2D', '3D', 'IMAX 3D'] }
    ]
  },
  {
    name: 'Prasads Multiplex: IMAX Arena',
    city: 'Hyderabad',
    location: 'Necklace Road',
    address: 'NTR Gardens, Necklace Road, Hyderabad, Telangana 500004',
    facilities: ['Large Screen', 'Dolby Atmos', 'Gaming Zone', 'Multi Cuisine'],
    screens: [
      { screenNumber: 1, name: 'Audi 1 Giant Screen', seatingCapacity: 60, soundSystem: 'Dolby Atmos', formats: ['2D', '3D'] }
    ]
  }
];

module.exports = { movies, theatres, dates };

