export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  genre: string[];
  duration: string;
  releaseDate: string;
  description: string;
  cast: string[];
  type: 'movie';
}

export interface Event {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  venue: string;
  priceMin: number;
  type: 'concert' | 'sports' | 'theater';
  description: string;
}

export interface ShowTime {
  id: string;
  time: string;
  hall: string;
  price: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  type: 'standard' | 'vip';
  price: number;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  seats: string[];
  totalAmount: number;
  date: string;
  time: string;
  venue: string;
  qrCode: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
