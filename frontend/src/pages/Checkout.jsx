import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  Film,
  Calendar,
  Clock,
  MapPin,
  Lock,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookingData = location.state || {};
  const { show, selectedSeats = [], pricing = {} } = bookingData;

  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [processing, setProcessing] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Alex Johnson');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  // UPI details
  const [upiId, setUpiId] = useState('user@okhdfcbank');

  if (!show || selectedSeats.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>No booking in progress</h2>
        <p style={{ color: '#94a3b8', margin: '16px 0' }}>Please select a movie and seats first.</p>
        <Link to="/movies" className="btn-primary">
          Browse Movies
        </Link>
      </div>
    );
  }

  const movie = show.movie || {};
  const theatre = show.theatre || {};

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Create booking payload
      const payload = {
        showId: show._id,
        seatIds: selectedSeats.map((s) => s._id),
        paymentMethod,
        paymentDetails: {
          cardNumber: cardNumber.replace(/\s+/g, ''),
          cardHolder,
          upiId
        }
      };

      const res = await API.post('/bookings', payload);

      if (res.data.success) {
        toast.success('Payment authorized! Ticket generated.');
        navigate(`/booking-success/${res.data.booking._id}`, {
          state: { booking: res.data.booking }
        });
      }
    } catch (err) {
      console.error('Payment failed:', err);
      const msg = err.response?.data?.message || 'Transaction could not be processed. Please try again.';
      toast.error(msg);
      setProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '30px 20px 80px' }}>
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          marginBottom: '20px'
        }}
      >
        <ChevronLeft size={18} /> Modify Seats
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Left: Payment Form */}
        <div>
          <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={18} color="#10b981" /> Secure Payment Gateway
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '24px' }}>
              Select your payment method to complete ticket reservation
            </p>

            {/* Payment Method Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('Credit/Debit Card')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: paymentMethod === 'Credit/Debit Card' ? '1px solid #e50914' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: paymentMethod === 'Credit/Debit Card' ? 'rgba(229, 9, 20, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: paymentMethod === 'Credit/Debit Card' ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                <CreditCard size={18} color={paymentMethod === 'Credit/Debit Card' ? '#e50914' : '#94a3b8'} />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: paymentMethod === 'UPI' ? '1px solid #e50914' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: paymentMethod === 'UPI' ? 'rgba(229, 9, 20, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: paymentMethod === 'UPI' ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                <Smartphone size={18} color={paymentMethod === 'UPI' ? '#e50914' : '#94a3b8'} />
                <span>UPI / QR</span>
              </button>
            </div>

            {/* Card Form */}
            {paymentMethod === 'Credit/Debit Card' && (
              <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    CARD NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="form-input"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    CARDHOLDER NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="form-input"
                    placeholder="Name on Card"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      VALID THRU
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="form-input"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="form-input"
                      placeholder="•••"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px',
                    fontSize: '1rem',
                    marginTop: '12px'
                  }}
                >
                  {processing ? (
                    'Authorizing Payment...'
                  ) : (
                    <>
                      <Lock size={16} /> Pay ₹{pricing.grandTotal} Securely
                    </>
                  )}
                </button>
              </form>
            )}

            {/* UPI Form */}
            {paymentMethod === 'UPI' && (
              <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    ENTER VIRTUAL PAYMENT ADDRESS (UPI ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="form-input"
                    placeholder="e.g. mobile@upi or username@okaxis"
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiId(`user@${app.toLowerCase().replace(' ', '')}`)}
                      className="demo-pill"
                    >
                      {app}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px',
                    fontSize: '1rem',
                    marginTop: '12px'
                  }}
                >
                  {processing ? (
                    'Connecting to UPI PSP...'
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Verify & Pay ₹{pricing.grandTotal}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Guarantee */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px', color: '#64748b', fontSize: '0.78rem' }}>
              <ShieldCheck size={18} color="#10b981" />
              <span>256-bit SSL encrypted. 100% safe & certified checkout.</span>
            </div>
          </div>
        </div>

        {/* Right: Booking Order Summary */}
        <div>
          <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '18px' }}>
              Booking Summary
            </h3>

            {/* Movie Info */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{ width: '60px', height: '88px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '4px' }}>{movie.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#38bdf8' }}>{show.format} • {show.language}</p>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                  {theatre.name} ({show.screenName})
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {show.date} at {show.time}
                </p>
              </div>
            </div>

            {/* Seat List */}
            <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                SELECTED SEATS ({selectedSeats.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedSeats.map((seat) => (
                  <div key={seat._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#ffffff' }}>
                      Seat {seat.seatNumber} ({seat.tier})
                    </span>
                    <span style={{ color: '#cbd5e1' }}>₹{seat.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span>Subtotal</span>
                <span>₹{pricing.subTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span>Convenience Fee</span>
                <span>₹{pricing.convenienceFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span>GST (18%)</span>
                <span>₹{pricing.taxAmount}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff'
                }}
              >
                <span>Grand Total</span>
                <span style={{ color: '#10b981' }}>₹{pricing.grandTotal}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;

