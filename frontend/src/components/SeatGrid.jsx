import React from 'react';
import { Armchair, Sparkles, Check, Lock } from 'lucide-react';

const SeatGrid = ({
  seats = [],
  selectedSeats = [],
  onSeatClick,
  currentUserId
}) => {
  // Group seats by row
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Sort rows alphabetically (A to F)
  const rows = Object.keys(groupedSeats).sort();

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'VIP':
        return <span className="tag-pill badge-vip">VIP Recliner</span>;
      case 'Gold':
        return <span className="tag-pill badge-gold">Gold Club</span>;
      default:
        return <span className="tag-pill badge-silver">Silver Standard</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', userSelect: 'none' }}>
      
      {/* Cinema Screen Curve Projection */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-curve" />
        <div className="cinema-screen-label">Cinema Screen This Way</div>
      </div>

      {/* Seating Layout Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '680px', overflowX: 'auto', paddingBottom: '16px' }}>
        {rows.map((rowKey) => {
          const rowSeats = groupedSeats[rowKey].sort((a, b) => a.number - b.number);
          const rowTier = rowSeats[0]?.tier || 'Gold';
          const rowPrice = rowSeats[0]?.price || 200;

          return (
            <div
              key={rowKey}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {/* Row Label */}
              <div
                style={{
                  width: '26px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  textAlign: 'center'
                }}
              >
                {rowKey}
              </div>

              {/* Seats in this Row */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {rowSeats.map((seat, index) => {
                  const isSelected = selectedSeats.some((s) => s._id === seat._id);
                  const isBooked = seat.status === 'booked';
                  const isLockedByOther =
                    seat.status === 'locked' &&
                    seat.lockedBy &&
                    seat.lockedBy.toString() !== currentUserId?.toString();

                  let seatClass = 'seat-btn ';
                  if (isSelected) {
                    seatClass += 'seat-selected';
                  } else if (isBooked) {
                    seatClass += 'seat-booked';
                  } else if (isLockedByOther) {
                    seatClass += 'seat-locked';
                  } else {
                    seatClass += 'seat-available';
                  }

                  // Split row in middle with an aisle
                  const hasAisle = index === 4;

                  return (
                    <React.Fragment key={seat._id}>
                      <button
                        type="button"
                        className={seatClass}
                        disabled={isBooked || isLockedByOther}
                        onClick={() => onSeatClick(seat)}
                        title={`Seat ${seat.seatNumber} (${seat.tier}) - ₹${seat.price}${
                          isBooked ? ' [BOOKED]' : isLockedByOther ? ' [HELD BY SOMEONE]' : ''
                        }`}
                      >
                        {isSelected ? (
                          <Check size={14} strokeWidth={3} />
                        ) : isLockedByOther ? (
                          <Lock size={12} />
                        ) : (
                          seat.number
                        )}
                      </button>
                      {hasAisle && <div style={{ width: '24px' }} />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Tier indicator for Row */}
              <div
                style={{
                  width: '60px',
                  fontSize: '0.72rem',
                  color: '#64748b',
                  fontWeight: 600,
                  textAlign: 'left',
                  marginLeft: '8px'
                }}
              >
                ₹{rowPrice}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '12px 24px',
          marginTop: '28px',
          flexWrap: 'wrap',
          borderRadius: '30px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat-btn seat-available" style={{ width: '22px', height: '22px', cursor: 'default' }} />
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Available</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat-btn seat-selected" style={{ width: '22px', height: '22px', cursor: 'default' }}>
            <Check size={12} strokeWidth={3} />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Selected</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat-btn seat-booked" style={{ width: '22px', height: '22px', cursor: 'default' }} />
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Reserved / Sold</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat-btn seat-locked" style={{ width: '22px', height: '22px', cursor: 'default' }}>
            <Lock size={11} />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>Live Holding</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;

