# NexusTable Architecture

## Overview

NexusTable is a self-hosted virtual tabletop application designed for remote Dungeons & Dragons style gameplay.

The system is built around a modular architecture that separates:

- Core engine functionality
- Game data
- Rendering
- Multiplayer communication
- Optional extensions

The goal is to allow new features to be added without rewriting the core system.

---

# Core Design Principles

## Entity Component System (ECS)

NexusTable uses an Entity Component System architecture.

Entities represent objects in the world.

Examples:

- Player characters
- Monsters
- NPCs
- Doors
- Items
- Effects

Components describe data attached to entities.

Examples:

- Position
- Health
- Sprite
- Inventory
- Status effects

The engine does not contain specific game rules. It operates on generic entities and components.

---

# Scenes

Scenes represent playable spaces.

Examples:

- Dungeon rooms
- Battle maps
- Towns
- Outdoor areas

A scene contains:

- Scene metadata
- Map information
- Entities
- Environment settings

Scenes are the primary unit of saving and loading game state.

---

# Engine Architecture

The game engine provides:

## Event Bus

A communication system allowing different parts of the application to react to events without direct dependencies.

Examples:

- Entity movement
- Combat events
- Plugin events

---

## Entity Manager

Responsible for creating and managing entities.

---

## Component Manager

Responsible for storing and retrieving entity components.

---

## Scene Manager

Responsible for creating and managing scenes.

---

## Plugin Manager

Responsible for loading and controlling extensions.

---

# Rendering Architecture

Rendering is considered a core part of the client application.

The renderer is responsible for:

- Displaying maps
- Drawing grids
- Rendering tokens
- Visual effects

Plugins extend rendering functionality rather than replacing the renderer.

Examples:

- Fog of war
- Spell effects
- Condition indicators
- Lighting systems

---

# Multiplayer Architecture

The server is authoritative.

The client displays the current game state and sends requests.

The server validates changes and broadcasts updates.

Communication uses realtime WebSocket connections.

---

# Technology Stack

Frontend:

- React
- TypeScript
- Vite

Backend:

- Node.js
- Express
- Socket.IO

Project Structure:
apps/
client
server

packages/
shared
game-engine
plugin-sdk

---

# Future Goals

NexusTable aims to support:

- Multiple game systems
- Custom plugins
- Campaign management
- Advanced map tools
- Automation
- Community extensions