# NexusTable Plugin API

## Overview

Plugins extend NexusTable functionality without modifying the core engine.

Plugins can add:

- New gameplay systems
- Visual effects
- Automation
- Tools
- Integrations


---

# Plugin Interface

Every plugin must implement:

```typescript
interface NexusPlugin {

    name: string;

    version: string;

    initialize(): void;

    shutdown(): void;

}
Plugin Lifecycle
Initialize

Called when the plugin loads.

Used for:

Registering systems
Creating listeners
Loading resources
Shutdown

Called when the plugin is removed.

Used for:

Cleaning listeners
Releasing resources
Plugin Examples

Possible future plugins:

Fog of War

Adds:

Hidden areas
Exploration tracking
Vision systems
Combat Tracker

Adds:

Initiative order
Turn management
Combat states
Effects Plugin

Adds:

Spell animations
Status effects
Visual indicators
Plugin Design Rules

Plugins should:

Avoid modifying core engine files
Communicate through events
Store their own data
Remain independent where possible

The goal is to allow features to be added without breaking existing functionality.


---
