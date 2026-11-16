# Implementation Plan: In-App Notifications

## Overview

Add a persistent notification feed and header bell for patient, dermatologist, and admin users. Notifications are created from appointment and payment events and shown only to their intended recipient.

## Architecture Decisions

- Store notifications in MongoDB and scope all reads and updates to the authenticated recipient.
- Poll the notification feed while the dashboard is open; no realtime transport is currently configured.
- Link notification actions to the relevant appointment or payment page.

## Task List

### Phase 1: Notification foundation
- [x] Add a notification model, authenticated feed endpoint, and read-state endpoints.
- [x] Add a header bell with unread count, dropdown feed, and polling for all dashboard roles.

### Phase 2: Event delivery
- [x] Notify the selected dermatologist and admins when an appointment is booked.
- [x] Notify the selected dermatologist and admins when a receipt is uploaded; notify the patient when payment is verified or rejected.
- [x] Notify the patient when the dermatologist adds or changes a meeting link.

### Checkpoint: Complete
- [x] Confirm recipients, unread counts, read state, and destination pages for each event by code inspection.
- [x] Build frontend and syntax-check backend changes.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Notifications can expose another user's appointment details | High | Always query and mutate notifications by both notification ID and authenticated recipient ID. |
| Repeated edits can generate duplicate notifications | Medium | Create notifications only when a relevant state changes (for example, a new or changed meeting link). |

## Open Questions

- None. Recipients are inferred from the named roles and the event's linked appointment.
