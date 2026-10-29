# Food Delivery App – Order Tracking Feature

## Domain Model (UML/ERD)

### Entities & Relationships

- **Order**
  - orderId (PK)
  - customerId (FK)
  - restaurantId (FK)
  - deliveryPartnerId (FK, nullable until assigned)
  - status (enum: Confirmed, Accepted, Preparing, ReadyForPickup, PartnerAssigned, PickedUp, NearDestination, Delivered, Cancelled)
  - eta (timestamp)
  - placedAt (timestamp)
  - completedAt (timestamp, nullable)
  - cancelledAt (timestamp, nullable)
  - lastStatusUpdateAt (timestamp)
  - timeline (array of status changes)

- **Customer**
  - customerId (PK)
  - name
  - contactInfo
  - accountStatus

- **Restaurant**
  - restaurantId (PK)
  - name
  - location
  - contactInfo

- **DeliveryPartner**
  - deliveryPartnerId (PK)
  - name
  - photoUrl
  - contactApproved (boolean)
  - location (current, nullable)

- **OrderStatusChange**
  - statusChangeId (PK)
  - orderId (FK)
  - status
  - changedAt

- **SupportInteraction**
  - supportId (PK)
  - orderId (FK)
  - customerId (FK)
  - type (enum: Delay, Cancellation, Refund, General)
  - interactionAt

- **AnalyticsEvent**
  - eventId (PK)
  - orderId (FK)
  - eventType
  - eventTimestamp

#### Relationships:
- Order belongs to Customer
- Order belongs to Restaurant
- Order optionally belongs to DeliveryPartner
- Order has many OrderStatusChange
- Order has many SupportInteraction
- Order has many AnalyticsEvent


## High-Level Design (HLD)

### Architecture Overview

```
[Customer App] <-> [API Gateway] <-> [Order Tracking Service]
                                   |
                +------------------+--------------+
                |                  |              |
        [Order Management]   [Restaurant Service] [Delivery Partner Service]
                |                  |              |
        [ETA Calculation Service]  |      [Map Provider]
                |                  |              |
        [Notification Service]     |     [Analytics Pipeline]
                |                  |              |
        [Support Platform]         |     [AuthN/AuthZ Service]
```

#### Major Components:
- **Order Tracking Service**: Central state machine, aggregates updates, manages timeline, exposes tracking API.
- **Order Management Service**: Source of truth for order lifecycle.
- **Restaurant Service**: Emits preparation/ready events.
- **Delivery Partner Service**: Emits assignment, pickup, location.
- **ETA Calculation Service**: Estimates delivery time.
- **Notification Service**: Push/SMS/email.
- **Map Provider**: Renders delivery progress/location.
- **Analytics Pipeline**: Event ingestion, metrics.
- **Support Platform**: Customer support integration.
- **Authentication/Authorization**: RBAC/ABAC, session validation.

#### Integration Points:
- Real-time event channel (WebSocket/SSE)
- REST APIs for order, restaurant, partner, ETA
- Map provider API (location, route rendering)
- Notification service (push/SMS/email)
- Analytics/event pipeline
- Customer support API

#### Security & Compliance Features:
- **Input Validation**: All user and API inputs validated for type, format, and range.
- **Output Filtering**: Responses filtered for sensitive partner/customer data.
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit.
- **RBAC/ABAC**: Role-based and attribute-based access control for customer, partner, support roles.
- **Audit Logging**: All status changes, partner assignments, and support interactions logged.
- **Secrets Management**: Use enterprise vault for API keys, credentials.

##### Compliance:
- **Data Retention**: Order tracking history retained per regulatory policy, with configurable expiration.
- **Consent Management**: Customer consent for location, notifications.
- **Data Lineage**: Analytics events and status changes tracked end-to-end.
- **Compliance Reporting**: Generate audit reports on status transitions, data access, and retention.

#### Error Handling Patterns:
- **Retries**: Automatic retry on transient failures (network, event delivery).
- **Logging**: Structured error and event logs.
- **Circuit Breaker**: Protects downstream services during outages.
- **Recovery**: Show last known data and recovery path during network loss.

### Data Flow
1. Restaurant updates order status.
2. Event published to Order Management.
3. Order Tracking Service consumes event, updates timeline/status.
4. ETA Calculation Service updates ETA.
5. Delivery Partner Service updates location/status.
6. Customer App receives real-time updates (status, ETA, map).
7. Analytics Pipeline records interaction/event.
8. Support Platform available for exceptions.

---

## Validation Report

### Requirements Coverage
- [x] Order status display
- [x] Status timeline
- [x] ETA calculation/display
- [x] Live updates (WebSocket/SSE)
- [x] Delivery partner assignment
- [x] Map display after pickup
- [x] Delay/cancellation handling
- [x] Completion/rating exposure
- [x] Support entry point
- [x] Persistence/recovery for active orders
- [x] Failure state for unavailable live data

### Compliance Checklist
- [x] Input validation, output filtering
- [x] AES-256/TLS 1.3 encryption
- [x] RBAC/ABAC enforcement
- [x] Audit logging of order events
- [x] Secrets management via vault
- [x] Data retention policy
- [x] Consent management for location/notifications
- [x] Data lineage tracking
- [x] Compliance reporting

### Error Handling
- [x] Retry on transient errors
- [x] Logging of exceptions, out-of-order events
- [x] Circuit breaker for downstream failure
- [x] Graceful degradation on network loss

### Open Questions (for further refinement)
- What is a material ETA change?
- Partner location refresh frequency?
- Map visibility before pickup?
- Allowed partner contact methods?
- Cancellation/refund actions in tracking?
- Historical data retention duration?

---

**End of HLD & Domain Model for foodDeliveryApp2910 Order Tracking Feature**
