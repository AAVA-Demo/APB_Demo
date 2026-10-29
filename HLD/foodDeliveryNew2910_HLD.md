# Domain Model (UML/ERD)

**Entities & Attributes**:
- **Order**
  - orderId (PK)
  - userId (FK)
  - restaurantId (FK)
  - deliveryPartnerId (FK, nullable)
  - status (enum: Confirmed, Accepted, Preparing, ReadyForPickup, PartnerAssigned, PickedUp, NearDestination, Delivered, Cancelled)
  - createdAt, updatedAt
  - eta
  - statusTimeline (ordered list of status events)
  - cancellationReason (nullable)
  - rating (nullable)
  - supportContacted (boolean)

- **User**
  - userId (PK)
  - name
  - contactInfo
  - authCredentials
  - roles (enum: customer, admin, support)
  - consentGiven (boolean)
  - preferences

- **Restaurant**
  - restaurantId (PK)
  - name
  - address
  - contactInfo

- **DeliveryPartner**
  - partnerId (PK)
  - name
  - photo
  - contactMethod (enum: phone, in-app, none)
  - location (lat/lon, nullable)

- **OrderEvent**
  - eventId (PK)
  - orderId (FK)
  - status
  - timestamp
  - details

- **SupportTicket**
  - ticketId (PK)
  - orderId (FK)
  - userId (FK)
  - createdAt, resolvedAt
  - status

**Relationships**:
- User 1---* Order
- Restaurant 1---* Order
- DeliveryPartner 1---* Order
- Order 1---* OrderEvent
- Order 1---* SupportTicket

**Diagram (textual ERD):**
```
User (1) ────< (M) Order >──── (1) Restaurant
             │
             >──── (1) DeliveryPartner
             │
             >────< (M) OrderEvent
             │
             >────< (M) SupportTicket
```

---

# High-Level Design (HLD) Document

## Architecture Overview

- **Frontend**: Web/mobile app
  - Real-time order tracking UI (status, timeline, ETA, map, support, ratings)
  - Accessibility and responsive design

- **Backend Services**:
  - **Order Service** (source of truth)
  - **Restaurant Service** (order status, preparation events)
  - **Delivery Partner Service** (assignment, pickup, location)
  - **ETA Service** (delivery time estimation)
  - **Notification Service** (push/SMS/email)
  - **Support Service**
  - **Analytics Pipeline**
  - **Authentication/Authorization Service**
  - **Map Provider Integration**

- **Real-Time Data Channel**:
  - WebSocket/SSE for live status and ETA updates

- **Data Store**: Relational DB (PostgreSQL or similar) for transactional data; Event log for status timeline

## Major Components

- **Order Tracking API**: Aggregates real-time order state, ETA, and partner location
- **Event Processing**: Handles restaurant and partner events, updates order state machine
- **Notification Engine**: Triggers alerts for delays, cancellations, and completion
- **Support Integration**: In-app contextual support, ticketing, escalation
- **Security Layer**: RBAC/ABAC enforcement, input/output validation, encrypted comms
- **Audit & Analytics**: Records state changes, user actions, and compliance events

## Integration Points

- Third-party map/location provider (for live delivery map)
- SMS/push/email providers (for notifications)
- External analytics system (for event and engagement metrics)
- Customer support/ticketing system

## Security & Compliance Features

- **Input Validation**: All external/user inputs strictly validated
- **Output Filtering**: Sensitive partner/user data exposure controlled
- **Encryption**: AES-256 for data at rest, TLS 1.3 for all network comms
- **RBAC/ABAC**: Only authorized users can access order tracking; support/admin have scoped access
- **Audit Logging**: All state transitions, sensitive actions, and access attempts logged and monitored
- **Secrets Management**: All credentials and secrets managed via vault or secure service
- **Data Retention**: Tracking and location data stored per regulatory and business policy; user consent tracked
- **Consent Management**: Explicit consent required for location sharing, notifications, and analytics
- **Data Lineage**: All updates/events timestamped and traceable
- **Compliance Reporting**: Automated reports for data access, retention, and consent

## Data Flow

1. User places order → Order Service creates order, emits event
2. Restaurant accepts/prepares/completes → Restaurant Service emits events
3. Delivery partner assigned/picked up → Partner Service emits events, including location
4. ETA Service updates estimate as events occur
5. Real-time channel pushes updates to client
6. Client UI updates status, timeline, ETA, and map
7. Notifications sent for delays, cancellations, or completion
8. Analytics pipeline records interactions, events, and support actions

## Error Handling

- **Retries**: Network and event processing use exponential backoff with circuit breaker pattern
- **Graceful Degradation**: If real-time updates or location unavailable, last known state shown, retry attempts logged
- **Failure Logging**: All errors, retries, and fallback paths logged for monitoring
- **Edge Cases**: Duplicate/out-of-order events handled via timestamp/version checks

---

# Validation Report

## Coverage Checklist

- [x] All functional requirements from PRD are addressed in the domain model and HLD
- [x] Entities, attributes, and relationships extracted and mapped
- [x] Real-time updates, ETA, status timeline, partner info, map, support, and analytics included
- [x] Edge cases and error handling described and mitigated
- [x] Security controls (input validation, RBAC, encryption, secrets) included per enterprise standards
- [x] Compliance (data retention, consent, data lineage, reporting) explicitly addressed
- [x] Circuit breaker, retry, and logging patterns specified
- [x] Integration points with external providers and internal services clearly defined

## Compliance

- [x] Data privacy and retention policies aligned to standard practice
- [x] Consent management and audit logging implemented
- [x] All sensitive data flows encrypted
- [x] Compliance reporting automated

## Error Handling

- [x] Network errors, data delays, and real-time failures handled gracefully
- [x] Duplicate/out-of-order events safely processed
- [x] Logging and monitoring in place for all critical paths

---

# Architecture Diagram (Text Description)

```
[User App] <--TLS--> [API Gateway] <---> [Order Service]
                                 |        [Restaurant Service]
                                 |        [Delivery Partner Service]
                                 |        [ETA Service]
                                 |        [Support Service]
                                 |        [Notification Engine]
                                 |        [Analytics Pipeline]
                                 |        [AuthN/AuthZ]
                                 |        [Map Provider]
          <--- WebSocket/SSE for Real-Time Updates --->
```

---

**End of HLD Output**
