# Itransition Course Project: Inventory Management System

## Project Overview
Inventory Management System is a web application that allows users to create and manage custom inventories with a flexible field structure.
Each inventory can contain items with dynamically defined fields (text, number, boolean, date). Users can fully configure the structure of their inventories and manage items inside them.

**Deploy:** [https://spiffy-biscochitos-96b7d0.netlify.app/](https://spiffy-biscochitos-96b7d0.netlify.app/)

## Key Features
- User authentication and authorization (including social login)
- Role-based access control (Admin / Owner / Guest)
- Creation and management of inventories
- Dynamic custom fields for inventories
- Item management based on the defined field structure
- Comments and likes
- Full-text search across inventories
- Sorting, filtering, and pagination of data
- Real-time comments using WebSocket
- Responsive Angular UI with Angular Material

##  1. Purpose of the system
Develop a web application for creating and managing user inventories with a dynamic field structure. The system should allow users to independently create:
- Inventories
- Custom fields
- Values ​​for these fields
- Items
- Custom ID for items

## 2. Architecture
Web Application (Client-Server Architecture):
- Frontend: Angular SPA
- Backend: Node.js + Express REST API
- Database: PostgreSQL (relational database)
- Realtime: WebSocket (ws)
- Deployment: Netlify (frontend) + Render (server)

## 3. Functional requirements
### Authentication
- User registration, including social login
- Authorization
- Administrators have full access
- Owner (authorized users) - access only to own inventory/items and inventories/items they have write access to
- Non-auth users - read-only
### Inventory management
The users can:
- create an inventory
- view a list of their inventories and inventories they have write access to
- edit
- delete
- configure
### Field Management (Dynamic Structure)
The users can:
- add custom fields to the inventory
- delete
Each field contains:
- name
- data type
Supported types:
- text
- number
- boolean
- date
The field structure is defined by the user.
### Item management
The users can:
- create an item
- edit
- delete
When creating an item:
- the system displays a form based on the created custom fields
- the input type depends on the custom field type

## 4. Data architecture
### The database contains:
- Users — system users
- Categories — inventory categories
- Tags — tags for inventories
- Inventories — collections (inventories)
- Items — items within an inventory
- Comments — comments on inventories
- Likes — likes for items
### Relations:
- Inventory → belongs to user (inventory author)
- Inventory → belongs to category
- Inventory ↔ has multiple tags (many-to-many)

- Item → belongs to inventory
- Item → belongs to user (item author)

- Comment → belongs to user
- Comment → belongs to inventory
- Like → belongs to user
- Like → belongs to item
### Model Features:
- Inventory defines the structure of fields (string, number, text, boolean, url) via *_label
- Items store the values ​​of these fields (string_1, integer_1, text_1, etc.)
- customId — the user ID of the item within the inventory
- version is used for optimistic locking
- items are deleted automatically if inventory is deleted (onDelete: Cascade)
- one user can only like one item

## Screenshots



