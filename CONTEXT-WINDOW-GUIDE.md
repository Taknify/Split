# Using Neo4j Graph Model as a Context Window

This guide explains how to effectively use the Neo4j graph model of your Next.js application as a context window for AI tools and development.

## Overview

The enhanced graph model provides a comprehensive representation of your codebase, including:

- Full directory structure
- All components and their relationships
- Pages and API routes
- External dependencies
- Functional relationships between components

This structured representation makes it easier for AI tools to understand the context and relationships in your codebase.

## Loading the Enhanced Graph Model

Run the enhanced graph creator script to load the optimized model:

```bash
node enhanced-graph-creator.js
```

This will create a comprehensive graph in Neo4j with rich metadata and relationships.

## Useful Neo4j Queries for Context Generation

### 1. General Structure Exploration

To understand the overall structure:

```cypher
// View all directories
MATCH (d:Directory) RETURN d

// View directory hierarchy
MATCH path = (d1:Directory)-[:CONTAINS*]->(d2:Directory)
RETURN path

// View all components
MATCH (c:Component) RETURN c
```

### 2. Component Relationships

For understanding how components are related:

```cypher
// See what components the homepage imports
MATCH path = (:File {path: "/src/app/page.tsx"})-[:IMPORTS]->(c:Component)
RETURN path

// Find which components use the Icon component
MATCH path = (c:Component)-[:IMPORTS]->(:Component {name: "Icon"})
RETURN path
```

### 3. API and Data Flow

For understanding API structure and data flow:

```cypher
// View all API routes
MATCH (a:API) RETURN a

// See which pages call which APIs
MATCH path = (:Page)-[:CALLS_API]->(:API)
RETURN path

// Understand data flow
MATCH path = ()-[:UPDATES_DATA_FOR]->()
RETURN path
```

### 4. Dependency Analysis

For understanding dependencies:

```cypher
// View external dependencies
MATCH (e:ExternalDependency) RETURN e

// See which files depend on Stripe
MATCH path = (f)-[:DEPENDS_ON]->(:ExternalDependency {name: "Stripe"})
RETURN path
```

## Using as Context with AI Tools

When working with AI tools like Claude, you can use Neo4j queries to generate relevant context about your codebase. For example:

### Understanding a Component

If you're working on the Features component, you could run:

```cypher
// Get context for the Features component
MATCH (f:Component {name: "Features"})
OPTIONAL MATCH p1 = (f)-[:IMPORTS]->(dep)
OPTIONAL MATCH p2 = (page)-[:IMPORTS]->(f)
RETURN f, p1, p2
```

### Understanding API Integration

If you're working on Stripe integration:

```cypher
// Get Stripe integration context
MATCH (api:API)
MATCH (stripe:File)
WHERE api.path CONTAINS "api" AND stripe.path CONTAINS "stripe"
OPTIONAL MATCH p1 = (api)-[:IMPORTS|DEPENDS_ON*]->(s)
OPTIONAL MATCH p2 = (page)-[:CALLS_API]->(api)
RETURN api, stripe, p1, p2
```

## Best Practices

1. **Focus on Relationships**: The power of the graph model is in the relationships between components. Use these to understand dependencies and data flow.

2. **Start Small**: Begin with specific queries about the components you're working on, then expand to understand related components.

3. **Use Descriptions**: The nodes include description metadata, which can provide additional context.

4. **Update the Model**: When making significant changes to the codebase, update the graph model to ensure the context remains accurate.

## Example Workflow

1. **Identify Component**: Determine which component you're working on
2. **Query Context**: Use Neo4j to query relevant context about the component
3. **Include in Prompt**: Include the context in your prompt to AI tools
4. **Refine**: Refine the context based on the specific task

This approach ensures AI tools have the right context about your codebase structure, making their assistance more accurate and relevant.

## Updating the Context Model

As your codebase evolves, update the graph model by running:

```bash
node enhanced-graph-creator.js
```

This will rebuild the context graph with your latest code structure.
