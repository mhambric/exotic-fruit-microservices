## Exotic Fruit Microservices System

This repository contains multiple independent microservices developed as part of a service oriented system for an Exotic Fruit Storefront application. Each microservice is designed to operate independently and communicate using clearly defined interfaces.

The project demonstrates different microservice communication patterns including file based data exchange and HTTP based services.

## Microservices Overview


## Inventory Microservice
## Type: File based microservice

The inventory microservice manages product availability and stock levels. It processes structured JSON requests and produces JSON responses without using an HTTP server.

## Key Characteristics
- Reads input from request.json
- Writes results to response.json
- Operates independently of a web server
- Designed for asynchronous integration with other system components

## Files
- inventory_microservice.js
- items.json
- request.json
- response.json
- test_inventory.js

## Search Microservice

## Type: HTTP based microservice

The search microservice provides keyword based product searching functionality. It runs as a lightweight server and responds to client requests over HTTP.

## Key Characteristics
- Node.js server implementation
- Supports product search queries
- Reads product data from JSON
- Returns structured search results

## Files
- server.js
- items.json
- search.html

## Notification Microservice

## Type: HTTP based microservice

The notification microservice simulates system generated notifications such as order updates or system alerts. It is designed to be consumed by other services or frontend components.

## Key Characteristics
- Node.js server implementation
- Reads and writes notification data in JSON format
- Designed for event driven communication

## Files
- server.js
- notifications.json

## System Design Goals
- Demonstrate independent microservice architecture
- Use multiple communication patterns
- Maintain clear service boundaries
- Support integration with a shared frontend application

## How This Connects to the Frontend

These microservices were designed to integrate with the Exotic Fruit Storefront frontend used in both the database system and the live demo application. The frontend interacts with each service independently, reinforcing separation of concerns and modular design.
