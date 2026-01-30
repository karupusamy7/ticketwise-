import React from 'react';
import { Seat } from '../types';

interface SeatMapProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, onSeatClick }) => {
  // Group seats by row
  const rows = Array.from(new Set(seats.map(s => s.row)));

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-dark-card rounded-xl shadow-lg border border-slate-700">
      {/* Screen Visual */}
      <div className="mb-10 w-full flex flex-col items-center">
        <div className="w-3/4 h-2 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 rounded-full mb-2 shadow-[0_0_20px_rgba(14,165,233,0.5)]"></div>
        <span className="text-dark-muted text-sm uppercase tracking-widest">Screen</span>
      </div>

      <div className="flex flex-col gap-3 items-center">
        {rows.map(row => (
          <div key={row} className="flex gap-2 items-center">
            <span className="w-6 text-dark-muted font-mono text-sm text-center">{row}</span>
            <div className="flex gap-2">
              {seats.filter(s => s.row === row).map(seat => {
                let seatColor = "bg-slate-600 hover:bg-slate-500 cursor-pointer"; // Available Standard
                
                if (seat.status === 'occupied') {
                  seatColor = "bg-slate-800 cursor-not-allowed opacity-50";
                } else if (seat.status === 'selected') {
                  seatColor = "bg-brand-500 shadow-[0_0_10px_#0ea5e9] text-white";
                } else if (seat.type === 'vip') {
                  seatColor = "bg-purple-900 border border-purple-500 hover:bg-purple-800 cursor-pointer"; // VIP
                }

                return (
                  <button
                    key={seat.id}
                    disabled={seat.status === 'occupied'}
                    onClick={() => onSeatClick(seat)}
                    className={`
                      w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-md text-xs font-medium transition-all duration-200
                      flex items-center justify-center
                      ${seatColor}
                    `}
                    title={`Row ${seat.row} Seat ${seat.number} - $${seat.price}`}
                  >
                    {seat.status === 'selected' && <span className="text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex justify-center gap-6 text-sm text-dark-muted">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-600 rounded"></div> Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-brand-500 rounded shadow-[0_0_5px_#0ea5e9]"></div> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-900 border border-purple-500 rounded"></div> VIP
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-800 opacity-50 rounded"></div> Sold
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
