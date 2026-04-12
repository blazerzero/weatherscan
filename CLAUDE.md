# Weatherscan

## Versioning

Bump `version` in `package.json` with every set of changes using semantic versioning:

- **Major** (`x.0.0`): Major structural changes or significant UI refactors
- **Minor** (`0.x.0`): New commands, features, or other functionality that don't drastically change the user experience but rather add to the tool
- **Patch** (`0.0.x`): Minor code tweaks, code cleanup, bug fixes, etc.

## Code Reuse

Always use shared utility functions and constants instead of duplicating logic. Before writing a new helper, check if an equivalent already exists in these files.
