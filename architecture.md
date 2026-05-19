# BuildHub Technical Architecture

## 1. Multi-Tenant Data Isolation
Every document in the database (except global marketplace products) contains a `company` field referencing the `Company` model. 
**Rule**: All Backend controllers MUST include `{ company: req.user.companyId }` in their queries.

## 2. Authentication Flow
- **JWT**: Tokens are stored in LocalStorage.
- **Middleware**: The `protect` middleware decodes the token and attaches the user object to `req`.
- **RBAC**: The `authorize` middleware prevents Staff from accessing `/finance` or `/admin` routes.

## 3. The BOQ Pricing Logic
Pricing is determined in this priority:
1. **User Input**: Manual entry.
2. **Marketplace Sync**: Real-time prices from suppliers.
3. **AI Suggestion**: Last resort assistance.
*Note: Any item sourced from AI remains in a 'pending' state until a user clicks 'Verify'.*

## 4. Frontend Design System
- **Spacing**: Uses a large-scale padding system (p-8 to p-12) for an airy Apple feel.
- **Corners**: Standard `rounded-[2.5rem]` or `rounded-[3rem]` for containers.
- **Visuals**: Primary color `#001529` (Navy), Accent `#007AFF` (Blue).