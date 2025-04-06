// This JavaScript can be used in Neo4j Browser to create custom visualizations
// Just paste it into the Neo4j Browser console after running the Cypher script

// Configuration for the visualization
const config = {
  // Node colors by type
  nodeColors: {
    File: '#4CAF50',       // Green
    Component: '#2196F3',  // Blue
    Directory: '#9C27B0',  // Purple
    API: '#F44336',        // Red
    UIElement: '#FF9800',  // Orange
    ExternalDependency: '#795548' // Brown
  },
  
  // Relationship colors
  relationshipColors: {
    CONTAINS: '#757575',
    IMPORTS: '#03A9F4',
    PART_OF: '#8BC34A',
    HANDLES: '#FF5722',
    PROCESSES: '#E91E63',
    DEPENDS_ON: '#607D8B',
    CONTAINS_ELEMENT: '#FFC107',
    HAS_STATE: '#00BCD4'
  }
};

// Function to get node color
function getNodeColor(labels) {
  if (labels.includes("API")) return config.nodeColors.API;
  if (labels.includes("Component")) return config.nodeColors.Component;
  if (labels.includes("Directory")) return config.nodeColors.Directory;
  if (labels.includes("UIElement")) return config.nodeColors.UIElement;
  if (labels.includes("ExternalDependency")) return config.nodeColors.ExternalDependency;
  return config.nodeColors.File;
}

// Apply styling to visualization
function applyStyleToCurrent() {
  // Get all nodes in the current visualization
  const nodes = vis.nodes();
  const relationships = vis.relationships();
  
  // Update node styling
  vis.update(nodes.map(node => {
    return {
      id: node.id,
      caption: node.propertyMap.name || node.labels[0],
      color: getNodeColor(node.labels),
      size: node.labels.includes("Directory") ? 20 : 15,
      borderWidth: 2,
      borderColor: "#fff"
    };
  }));
  
  // Update relationship styling
  vis.update(relationships.map(rel => {
    return {
      id: rel.id,
      caption: rel.type,
      color: config.relationshipColors[rel.type] || "#999",
      width: 2,
      arrows: true
    };
  }));
}

// Helper function to run queries with custom visualizations
function runQuery(query) {
  return new Promise((resolve) => {
    const session = driver.session();
    session
      .run(query)
      .then(result => {
        const records = result.records;
        session.close();
        resolve(records);
        setTimeout(applyStyleToCurrent, 100);
      })
      .catch(error => {
        console.error(error);
        session.close();
      });
  });
}

// Example queries with enhanced visualization
const queries = {
  // Get full codebase structure
  fullCodebase: `
    MATCH (n)
    OPTIONAL MATCH (n)-[r]->(m)
    RETURN n, r, m
    LIMIT 100
  `,
  
  // Component hierarchy
  componentHierarchy: `
    MATCH path = (p:File {path: '/src/app/page.tsx'})-[:IMPORTS]->(c:Component)
    OPTIONAL MATCH (c)-[:CONTAINS_ELEMENT]->(e)
    RETURN path, c, e
  `,
  
  // API endpoints and their handlers
  apiEndpoints: `
    MATCH (a:API)-[r:HANDLES]->(p)
    RETURN a, r, p
  `,
  
  // Directory structure
  directoryStructure: `
    MATCH path = (d:Directory)-[:CONTAINS*]->(f)
    RETURN path
    LIMIT 100
  `,
  
  // Show files with their imports
  dependencies: `
    MATCH (f)-[:IMPORTS]->(dep)
    RETURN f, dep
  `
};

// Function to create custom dashboard
function createDashboard() {
  const dashboard = document.createElement('div');
  dashboard.id = 'code-explorer';
  dashboard.style.cssText = 'position:fixed;top:10px;right:10px;background:#fff;padding:10px;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.1);z-index:1000;';
  
  const title = document.createElement('h3');
  title.textContent = 'Code Explorer';
  title.style.marginTop = '0';
  dashboard.appendChild(title);
  
  // Add buttons for each query
  Object.entries(queries).forEach(([name, query]) => {
    const button = document.createElement('button');
    button.textContent = name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    button.style.display = 'block';
    button.style.margin = '5px 0';
    button.style.padding = '5px 10px';
    button.onclick = () => runQuery(query);
    dashboard.appendChild(button);
  });
  
  document.body.appendChild(dashboard);
}

// Initialize
setTimeout(() => {
  createDashboard();
  runQuery(queries.fullCodebase);
}, 1000);

console.log("Code explorer dashboard initialized! Check the top right corner of your Neo4j Browser.");
