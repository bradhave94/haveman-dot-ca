---
title: "HubSpot Utils"
description: "A web-based tool designed to help HubSpot developers and content managers manage pages, blog posts, and custom modules."
date: 2024-01-15
tags: ["hubspot", "javascript", "typescript", "astro"]
github: "https://github.com/bradhave94/hubspot-utils"
status: "Active Development"
---

## Overview

HubSpot Utils is a web-based tool to streamline the management and editing of HubSpot CMS assets. I created this application to serve as an utility for HubSpot developers and content managers, for managing pages, blog posts, and custom modules across HubSpot portals.

## Features

### 📄 Page Management

* View all site pages with status indicators
* Bulk template updating capabilities (update multiple pages in one click)
* Domain and slug management for multiple pages
* Archive and restore functionality with batch operations
* Grouped view by page status (published, draft, archived)

![Page management interface showing the list view of HubSpot pages with status indicators and bulk actions](/projects/hsutils-pages.png)

### 📝 Blog Post Management

* View all blog posts with metadata and quick edit capabilities
* Bulk tag management system for categorization
* URL/slug modification

![Blog management dashboard displaying post listings and tag management interface](/projects/hsutils-blogs.png)

### 🧩 Module Management

* Module editor with JSON support and syntax highlighting
* Tree-based module organization for better structure
* Field JSON editor

![Module management interface showing the JSON editor and module tree structure](/projects/hsutils-modules.png)

## Purpose

I built this tool to enhance the HubSpot development and content management workflow by:

* Simplifying bulk operations across multiple pages and posts
* Providing a more efficient interface for module management
* Reducing the time spent on repetitive tasks

## Tech Stack

I built this application using:
* Astro
* React components for interactive features
* Tailwind CSS for styling
* Monaco Editor for JSON editing
* HubSpot API integration
* TypeScript for type safety
* Netlify for deployment
