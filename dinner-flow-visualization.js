// Neo4j Visualization script for the Dinner at Restaurant flow

/*
This script provides a visualization configuration for Neo4j Browser 
to better understand the relationships between entities in our
virtual card funding flow for the "Dinner at Restaurant" group.

Copy and paste this into Neo4j Browser after running the neo4j-graph-model-update.cypher script.
*/

// Run this query to visualize the complete flow
MATCH (u:User)-[:MEMBER_OF]->(g:Group {name: "Dinner at Restaurant"})
MATCH (g)-[:HAS_CARD]->(card:VirtualCard)
MATCH (g)-[:HAS_FUNDING_REQUEST]->(fr:FundingRequest)
MATCH (e:Expense)-[:BELONGS_TO]->(g)
MATCH (e)-[:HAS_SHARE]->(s:Share)-[:ASSIGNED_TO]->(u)
MATCH (u)-[:HAS_PAYMENT_METHOD]->(pm:PaymentMethod)
OPTIONAL MATCH (p1:Page)-[r:LINKS_TO]->(p2:Page)
RETURN *;

// Visualization style guide:
// Users: Blue
// Groups: Green
// Expenses: Red
// Shares: Orange
// Payment Methods: Purple
// Virtual Cards: Cyan
// Pages: Pink
// Funding Requests: Yellow

// Default style
:style {
  node: {
    diameter: "50px",
    color: "#A5ABB6",
    border-color: "#9AA1AC",
    border-width: "2px",
    text-color-internal: "#FFFFFF",
    font-size: "10px"
  },
  relationship: {
    color: "#A5ABB6",
    shaft-width: "1px",
    font-size: "8px",
    padding: "3px",
    text-color-external: "#000000",
    text-color-internal: "#FFFFFF",
    caption: "<type>"
  }
}

// Entity-specific styles
:style {
  node.User: {
    color: "#4C8EDA",
    border-color: "#2870c2",
    text-color-internal: "#FFFFFF",
    caption: "{name}"
  },
  node.Group: {
    color: "#57C7E3",
    border-color: "#23b3d7",
    text-color-internal: "#2A2C34",
    caption: "{name}"
  },
  node.Expense: {
    color: "#FF6C6C",
    border-color: "#ff2d2d",
    text-color-internal: "#FFFFFF",
    caption: "{description}"
  },
  node.Share: {
    color: "#F79767",
    border-color: "#f36924",
    text-color-internal: "#FFFFFF",
    caption: "{percentage}% (${amount})"
  },
  node.PaymentMethod: {
    color: "#D6C5FE",
    border-color: "#b396f8",
    text-color-internal: "#2A2C34",
    caption: "{type} •••• {last4}"
  },
  node.VirtualCard: {
    color: "#8DCC93",
    border-color: "#5db665",
    text-color-internal: "#2A2C34",
    caption: "{name}"
  },
  node.Page: {
    color: "#FFC454",
    border-color: "#d7a013",
    text-color-internal: "#2A2C34",
    caption: "{name}"
  },
  node.FundingRequest: {
    color: "#DA7194",
    border-color: "#cc3c6c",
    text-color-internal: "#FFFFFF",
    caption: "${amount} ({status})"
  }
}

// Relationship-specific styles
:style {
  relationship.MEMBER_OF: {
    color: "#4C8EDA",
    shaft-width: "2px"
  },
  relationship.HAS_CARD: {
    color: "#8DCC93",
    shaft-width: "2px"
  },
  relationship.BELONGS_TO: {
    color: "#FF6C6C",
    shaft-width: "2px"
  },
  relationship.HAS_SHARE: {
    color: "#F79767",
    shaft-width: "2px"
  },
  relationship.ASSIGNED_TO: {
    color: "#F79767",
    shaft-width: "2px"
  },
  relationship.HAS_PAYMENT_METHOD: {
    color: "#D6C5FE",
    shaft-width: "2px"
  },
  relationship.FUNDED_BY: {
    color: "#8DCC93",
    shaft-width: "2px"
  },
  relationship.LINKS_TO: {
    color: "#FFC454",
    shaft-width: "1px"
  },
  relationship.DISPLAYS: {
    color: "#DA7194",
    shaft-width: "1px"
  },
  relationship.HAS_FUNDING_REQUEST: {
    color: "#DA7194",
    shaft-width: "2px"
  }
}