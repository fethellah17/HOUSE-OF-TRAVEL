import { useState } from "react";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import { useUserBookings, useCreateBooking } from "@/hooks/useBookings";
import { useVoyages, useVoyageDetails } from "@/hooks/useVoyages";
import { useCreateDevisRequest } from "@/hooks/useRequests";
import { login, logout, signUp } from "@/services/authService";
import { SignupRequest, LoginRequest } from "@/types/database";
import { toast } from "sonner";

/**
 * EXAMPLE: Authentication Component
 */
export function AuthenticationExample() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      toast.success("Login successful!");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logged out");
    }
  };

  if (isLoading) return <div>Loading authentication...</div>;

  return (
    <div className="auth-container">
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.prenom}!</h2>
          <p>Email: {user?.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

/**
 * EXAMPLE: Voyages Listing Component
 */
export function VoyagesListExample() {
  const { voyages, total, isLoading, error } = useVoyages({
    page: 1,
    pageSize: 12,
  });

  if (isLoading) return <div>Loading voyages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="voyages-grid">
      <h2>Available Voyages ({total})</h2>
      <div className="grid grid-cols-3 gap-4">
        {voyages.map((voyage) => (
          <div key={voyage.id} className="card">
            {voyage.imageUrl && (
              <img src={voyage.imageUrl} alt={voyage.title} />
            )}
            <h3>{voyage.title}</h3>
            <p>{voyage.description?.substring(0, 100)}...</p>
            <p className="price">From {voyage.price}€</p>
            <p className="category">{voyage.category}</p>
            <p className="status">{voyage.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * EXAMPLE: Voyage Details with Booking
 */
export function VoyageBookingExample({ voyageId }: { voyageId: string }) {
  const { voyage, isLoading: voyageLoading } = useVoyageDetails(voyageId);
  const { create, isLoading: bookingLoading, error: bookingError } = useCreateBooking();

  const handleBooking = async () => {
    if (!voyage) return;

    const result = await create({
      voyageId: voyage.id,
      totalAdults: 2,
      totalChildren: 0,
      totalBabies: 0,
      departureDate: voyage.startDate,
      returnDate: voyage.endDate,
      travelers: [
        {
          nom: "Dupont",
          prenom: "Jean",
          dateOfBirth: new Date("1990-01-01"),
          gender: "male",
          passportNumber: "ABC123456",
          passportExpiry: new Date("2030-01-01"),
          travelerType: "adult",
        },
      ],
      roomDetails: [
        {
          roomType: "Double",
          numberOfGuests: 2,
        },
      ],
    });

    if (result.success) {
      toast.success("Booking created! Booking #: " + result.booking.booking_number);
    } else {
      toast.error(bookingError || "Booking failed");
    }
  };

  if (voyageLoading) return <div>Loading voyage details...</div>;
  if (!voyage) return <div>Voyage not found</div>;

  return (
    <div className="voyage-detail">
      <h1>{voyage.title}</h1>
      <img src={voyage.imageUrl || ""} alt={voyage.title} />

      <div className="voyage-info">
        <p><strong>Category:</strong> {voyage.category}</p>
        <p><strong>Price:</strong> {voyage.price}€</p>
        <p><strong>Duration:</strong> {voyage.duration}</p>
        <p><strong>Start:</strong> {new Date(voyage.startDate).toLocaleDateString()}</p>
        <p><strong>End:</strong> {new Date(voyage.endDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {voyage.status}</p>
        <p><strong>Available Spots:</strong> {voyage.maxCapacity - voyage.currentBookings}</p>
      </div>

      <div className="voyage-description">
        <h2>Description</h2>
        <p>{voyage.description}</p>
      </div>

      {voyage.stages && voyage.stages.length > 0 && (
        <div className="voyage-stages">
          <h2>Stages</h2>
          {voyage.stages.map((stage) => (
            <div key={stage.id} className="stage">
              <h3>{stage.name}</h3>
              <p>Days: {stage.durationDays}</p>
              <p>Hotel: {stage.hotelName}</p>
            </div>
          ))}
        </div>
      )}

      {voyage.features && voyage.features.length > 0 && (
        <div className="voyage-features">
          <h2>Features</h2>
          <ul>
            {voyage.features.map((feature) => (
              <li key={feature.id}>{feature.feature}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={bookingLoading}
        className="btn-primary"
      >
        {bookingLoading ? "Creating Booking..." : "Book Now"}
      </button>
    </div>
  );
}

/**
 * EXAMPLE: User Bookings List
 */
export function UserBookingsExample() {
  const { bookings, total, isLoading, error } = useUserBookings(1, 10);

  if (isLoading) return <div>Loading your bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  if (bookings.length === 0) {
    return <div>No bookings yet</div>;
  }

  return (
    <div className="user-bookings">
      <h2>My Bookings ({total})</h2>
      {bookings.map((booking) => (
        <div key={booking.id} className="booking-card">
          <h3>{booking.voyage?.title}</h3>
          <p>Booking #: {booking.booking_number}</p>
          <p>Status: {booking.booking_status}</p>
          <p>Payment: {booking.payment_status}</p>
          <p>Total: {booking.total_price}€</p>
          <p>Travelers: {booking.total_adults} adults, {booking.total_children} children</p>
        </div>
      ))}
    </div>
  );
}

/**
 * EXAMPLE: Devis Request Form
 */
export function DevisRequestExample() {
  const { create, isLoading, error } = useCreateDevisRequest();
  const [formData, setFormData] = useState({
    nom: "Dupont",
    prenom: "Jean",
    email: "jean@example.com",
    phone: "+33612345678",
    destination: "Égypte",
    numberOfAdults: 2,
    numberOfChildren: 1,
    departureDate: new Date("2025-06-15"),
  });

  const handleSubmit = async () => {
    const result = await create({
      ...formData,
      visaNeeded: false,
      flightWithWithout: "avec",
      numberOfChildren: formData.numberOfChildren,
    });

    if (result.success) {
      toast.success("Devis request sent successfully!");
      // Reset form
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        phone: "",
        destination: "",
        numberOfAdults: 1,
        numberOfChildren: 0,
        departureDate: new Date(),
      });
    } else {
      toast.error(error || "Failed to send request");
    }
  };

  return (
    <div className="devis-form">
      <h2>Request a Quote</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <input
          type="text"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          placeholder="Last Name"
        />
        <input
          type="text"
          value={formData.prenom}
          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          placeholder="First Name"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}

/**
 * EXAMPLE: Protected Route Component
 */
export function ProtectedPageExample() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="protected-page">
      <h1>Profile</h1>
      <p>Name: {user?.nom} {user?.prenom}</p>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phone}</p>
    </div>
  );
}
