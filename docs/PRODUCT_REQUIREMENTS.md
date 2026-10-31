# CARRY — Product Requirements Document (PRD)

## 1. Product Summary
CARRY is an on-demand commercial goods transportation and mini-truck booking mobile platform launching in Coimbatore, Tamil Nadu, India. It provides seamless booking of commercial mini-trucks and cargo vehicles with transparent pricing, instant/scheduled bookings, and configurable helper assistance.

## 2. Target Market & Boundary
- **Launch City**: Coimbatore, Tamil Nadu, India.
- **Geofence Constraints**: Initial pickups and drops restricted to Coimbatore city limits and surrounding industrial clusters (e.g., Peelamedu, Gandhipuram, Saravanampatti, Kurichi, Singanallur, Ganapathy, Thudiyalur).
- **Expansion**: Architected to support new cities via database configurations (`serviceAreas`) without application code modifications.

## 3. User Personas & Portals
1. **Customer**:
   - Individuals and businesses moving household items, commercial cargo, machinery, or packages.
   - Access: Customer Portal for booking, fare estimation, live tracking, and payment.
2. **Driver**:
   - Commercial vehicle owner-drivers operating Tata Ace, Bolero Pickups, 3-wheelers, or small trucks.
   - Access: Driver Portal for managing availability (Online/Offline), receiving job offers, milestone navigation, and tracking earnings.
3. **Administrator / Operations Team**:
   - CARRY operations team managing driver document verifications, active fleet, pricing rules, complaints, and dispatch interventions.

## 4. Key Functional Features
- **Booking Models**: Instant on-demand dispatch & advance scheduled booking.
- **Vehicle Fleet**:
  - 3-Wheeler Cargo (500 kg capacity)
  - Tata Ace / Mini Truck (750 - 1000 kg capacity)
  - Pickup / Bolero (1200 - 1750 kg capacity)
  - Larger Commercial Vehicle (2000+ kg capacity)
- **Helper Service**: Customer selects Driver-only, Driver + 1 helper, or Driver + 2 helpers.
- **Pricing Calculation**: Base fare + (Distance in km * Rate/km) + Helper charge + Waiting charges + Applicable taxes (stored and computed in integer paise).
- **Security & Authorization**: Single account, verified identity, owner-isolated data, server-enforced state transitions.
