# AXON API Integration
RESTful API endpoints for external system integrations.

## Overview
*   **Authentication:** Bearer token required via OAuth2.
*   **Rate Limiting:** Standard limits apply per tenant.
*   **Full Documentation:** Interactive Swagger/OpenAPI spec available at `/api/docs`.

## Key Integration Endpoints
*   `GET /api/v1/students` - Retrieve the student directory for third-party library or ID card systems.
*   `POST /api/v1/payments/webhook` - Endpoint for external payment gateway success/failure callbacks.
*   `POST /api/v1/attendance/biometric` - Sync hardware attendance logs directly into the AXON attendance module.