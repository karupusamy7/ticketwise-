import { Movie, Event, Seat } from './types';

export const MOCK_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Cyberpunk Horizons',
    posterUrl: 'https://picsum.photos/300/450?random=1',
    backdropUrl: 'https://picsum.photos/1200/600?random=1',
    rating: 4.8,
    genre: ['Sci-Fi', 'Action'],
    duration: '2h 15m',
    releaseDate: '2024-10-15',
    description: 'In a neon-soaked future, a rogue hacker discovers a conspiracy that threatens to rewrite human consciousness.',
    cast: ['Keanu Reeves', 'Ana de Armas'],
    type: 'movie'
  },
  {
    id: 'm2',
    title: 'The Last Symphony',
    posterUrl: 'https://picsum.photos/300/450?random=2',
    backdropUrl: 'https://picsum.photos/1200/600?random=2',
    rating: 4.5,
    genre: ['Drama', 'Music'],
    duration: '1h 50m',
    releaseDate: '2024-11-02',
    description: 'A retiring conductor attempts to compose his masterpiece while battling memory loss.',
    cast: ['Anthony Hopkins', 'Cate Blanchett'],
    type: 'movie'
  },
  {
    id: 'm3',
    title: 'Galactic Racers',
    posterUrl: 'https://picsum.photos/300/450?random=3',
    backdropUrl: 'https://picsum.photos/1200/600?random=3',
    rating: 4.2,
    genre: ['Action', 'Adventure'],
    duration: '2h 05m',
    releaseDate: '2024-09-28',
    description: 'The galaxy\'s fastest pilots compete in a high-stakes race across three star systems.',
    cast: ['Chris Pratt', 'Zoe Saldana'],
    type: 'movie'
  },
  {
    id: 'm4',
    title: 'Midnight Laughs',
    posterUrl: 'https://picsum.photos/300/450?random=4',
    backdropUrl: 'https://picsum.photos/1200/600?random=4',
    rating: 4.0,
    genre: ['Comedy'],
    duration: '1h 30m',
    releaseDate: '2024-10-05',
    description: 'A group of friends gets locked in a comedy club overnight.',
    cast: ['Kevin Hart', 'Tiffany Haddish'],
    type: 'movie'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Neon Music Festival',
    imageUrl: 'https://picsum.photos/600/400?random=5',
    date: 'Oct 20, 2024',
    venue: 'City Arena',
    priceMin: 89,
    type: 'concert',
    description: 'The biggest electronic music festival of the year featuring top DJs.'
  },
  {
    id: 'e2',
    title: 'Championship Finals',
    imageUrl: 'https://picsum.photos/600/400?random=6',
    date: 'Nov 12, 2024',
    venue: 'Grand Stadium',
    priceMin: 120,
    type: 'sports',
    description: 'Witness history in the making as the top two teams clash for the trophy.'
  },
  {
    id: 'e3',
    title: 'Romeo & Juliet: Reimagined',
    imageUrl: 'https://picsum.photos/600/400?random=7',
    date: 'Oct 25, 2024',
    venue: 'Royal Theater',
    priceMin: 45,
    type: 'theater',
    description: 'A modern twist on the classic Shakespearean tragedy.'
  }
];

export const generateSeats = (rows: number, cols: number): Seat[] => {
  const seats: Seat[] = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= cols; j++) {
      // Simulate some occupied seats
      const isOccupied = Math.random() < 0.2;
      const isVip = i >= rows - 2; // Last 2 rows are VIP
      
      seats.push({
        id: `${rowLabels[i]}${j}`,
        row: rowLabels[i],
        number: j,
        status: isOccupied ? 'occupied' : 'available',
        type: isVip ? 'vip' : 'standard',
        price: isVip ? 25 : 15
      });
    }
  }
  return seats;
};
