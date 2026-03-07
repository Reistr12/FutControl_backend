# FutControl - Domain Remodeling Guide

## Objective

Refactor the current domain entities based on the structure below.
All entities must follow auditing and soft delete patterns.

---

# Global Rules

All entities must contain:

- id (UUID - Primary Key)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)
- created_by (UUID, nullable)
- updated_by (UUID, nullable)
- deleted_by (UUID, nullable)

Soft delete must be used (no hard deletes).

---

# Entities

## 1. User

Represents a system user.

Fields:

- id (UUID)
- name (string)
- email (string, unique)
- password (string, hashed)

Audit fields (mandatory).

Constraints:

- email must be unique
- soft delete enabled

---

## 2. Organization

Represents a group of players.

Fields:

- id (UUID)
- name (string)
- description (text)
- location (string)
- is_active (boolean)
- is_public (boolean)
- max_members (integer)

Audit fields (mandatory).

---

## 3. OrganizationMember

Represents the relationship between a User and an Organization.

Fields:

- id (UUID)
- user_id (FK -> User.id)
- organization_id (FK -> Organization.id)

Audit fields (mandatory).

Constraints:

- unique(user_id, organization_id)
- soft delete enabled

---

## 4. Role

Represents a role within an organization context.

Fields:

- id (UUID)
- name (string)
- description (text)

Audit fields (mandatory).

---

## 5. OrganizationMemberRole

Represents role assignment for an organization member.

Fields:

- id (UUID)
- organization_member_id (FK -> OrganizationMember.id)
- role_id (FK -> Role.id)

Audit fields (mandatory).

---

## 6. Match

Represents a scheduled match inside an organization.

Fields:

- id (UUID)
- organization_id (FK -> Organization.id)
- max_players (integer)
- max_guests (integer)
- max_teams (integer)
- players_per_team (integer)
- price (decimal)
- schedule (timestamp)
- start_at (timestamp)
- end_at (timestamp)

Audit fields (mandatory).

Soft delete enabled.

---

## 7. MatchPlayer

Represents a participant in a match.

Fields:

- id (UUID)
- match_id (FK -> Match.id)
- organization_member_id (FK -> OrganizationMember.id, nullable)
- type (enum: MEMBER | GUEST)
- guest_name (string, nullable)

Audit fields (mandatory).

Rules:

- If type == MEMBER, organization_member_id must not be null.
- If type == GUEST, guest_name must not be null.
- Soft delete enabled.

---

# Architecture Guidelines

- Follow Clean Architecture principles.
- Entities must be persistence-agnostic.
- Validation rules must exist in domain layer.
- No business logic inside controllers.
- Repository interfaces must be abstracted.

---

# Goal

Refactor the current domain model to strictly follow this structure.
Ensure:

- Proper relations
- Proper constraints
- Audit compliance
- Soft delete consistency