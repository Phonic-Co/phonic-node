## 1.0.0 - 2026-02-20
* refactor: restructure agent API request format and update optional fields
* This change refactors the Phonic TypeScript SDK to improve API consistency by wrapping agent creation parameters in a body object and updating nullable field handling throughout the codebase. The agent request structure now follows REST API conventions with proper parameter organization.
* Key changes:
* Restructure AgentsCreateRequest to wrap parameters in a body object
* Update all agent-related examples and tests to use new request format
* Change nullable fields from `| null` to `| undefined` throughout type definitions
* Add required SIP authentication headers for custom phone number operations
* Improve WebSocket connection handling by requiring Authorization parameter
* Update conversation list and agent list examples with proper parameter structure
* Add audio URL field to Voice type for better voice preview capabilities
* 🌿 Generated with Fern

