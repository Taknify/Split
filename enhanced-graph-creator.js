// Enhanced Neo4j graph creator for Next.js codebase
// This creates a comprehensive graph model optimized for context generation
require('dotenv').config({ path: '.env.local' });
const neo4j = require('neo4j-driver');

// Neo4j connection details
const uri = process.env.NEO4J_URI || 'neo4j+s://4c97b8cf.databases.neo4j.io';
const user = process.env.NEO4J_USERNAME || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'NvHLGn7eQjNaZnCvb2poBzjsuxIXFzQLEy2Qql_lzgA';

// Create Neo4j driver
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

// Create the enhanced graph model
async function createEnhancedGraph() {
  try {
    console.log('Connecting to Neo4j at:', uri);
    
    // Clear existing data
    console.log('Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');
    
    // 1. Create main directories
    console.log('Creating directories...');
    await session.run('CREATE (n:Directory {name: "src", path: "/src"})');
    await session.run('CREATE (n:Directory {name: "app", path: "/src/app"})');
    await session.run('CREATE (n:Directory {name: "components", path: "/src/components"})');
    await session.run('CREATE (n:Directory {name: "api", path: "/src/app/api"})');
    await session.run('CREATE (n:Directory {name: "lib", path: "/src/lib"})');
    await session.run('CREATE (n:Directory {name: "stripe", path: "/src/lib/stripe"})');
    await session.run('CREATE (n:Directory {name: "icons", path: "/src/components/icons"})');
    
    // Feature directories
    await session.run('CREATE (n:Directory {name: "create-bill", path: "/src/app/create-bill"})');
    await session.run('CREATE (n:Directory {name: "create-group", path: "/src/app/create-group"})');
    await session.run('CREATE (n:Directory {name: "create-virtual-card", path: "/src/app/create-virtual-card"})');
    await session.run('CREATE (n:Directory {name: "virtual-card-details", path: "/src/app/virtual-card-details"})');
    
    // API directories
    await session.run('CREATE (n:Directory {name: "cards", path: "/src/app/api/cards"})');
    await session.run('CREATE (n:Directory {name: "payment", path: "/src/app/api/payment"})');
    await session.run('CREATE (n:Directory {name: "intents", path: "/src/app/api/payment/intents"})');
    await session.run('CREATE (n:Directory {name: "webhooks", path: "/src/app/api/webhooks"})');
    await session.run('CREATE (n:Directory {name: "stripe-webhook", path: "/src/app/api/webhooks/stripe"})');
    
    // 2. Create UI components
    console.log('Creating UI components...');
    await session.run('CREATE (n:Component:React:UI {name: "Header", path: "/src/components/Header.tsx", description: "Main navigation header component"})');
    await session.run('CREATE (n:Component:React:UI {name: "Footer", path: "/src/components/Footer.tsx", description: "Site footer with links and information"})');
    await session.run('CREATE (n:Component:React:UI {name: "Hero", path: "/src/components/Hero.tsx", description: "Hero section with main value proposition"})');
    await session.run('CREATE (n:Component:React:UI {name: "Features", path: "/src/components/Features.tsx", description: "Features showcase with cards"})');
    await session.run('CREATE (n:Component:React:UI {name: "HowItWorks", path: "/src/components/HowItWorks.tsx", description: "Step-by-step explanation of the product"})');
    await session.run('CREATE (n:Component:React:UI {name: "Testimonials", path: "/src/components/Testimonials.tsx", description: "User testimonials section"})');
    await session.run('CREATE (n:Component:React:UI {name: "CTA", path: "/src/components/CTA.tsx", description: "Call-to-action component"})');
    await session.run('CREATE (n:Component:React:UI {name: "Icon", path: "/src/components/icons/Icon.tsx", description: "Centralized icon component"})');
    
    // 3. Create pages
    console.log('Creating pages...');
    await session.run('CREATE (n:File:Page {name: "page.tsx", path: "/src/app/page.tsx", type: "page", description: "Homepage with marketing content"})');
    await session.run('CREATE (n:File:Layout {name: "layout.tsx", path: "/src/app/layout.tsx", type: "layout", description: "Root layout with metadata"})');
    await session.run('CREATE (n:File:Page {name: "page.tsx", path: "/src/app/create-bill/page.tsx", type: "page", description: "Bill creation form"})');
    await session.run('CREATE (n:File:Page {name: "page.tsx", path: "/src/app/create-group/page.tsx", type: "page", description: "Group creation form"})');
    await session.run('CREATE (n:File:Page {name: "page.tsx", path: "/src/app/create-virtual-card/page.tsx", type: "page", description: "Virtual card creation form"})');
    await session.run('CREATE (n:File:Page {name: "page.tsx", path: "/src/app/virtual-card-details/page.tsx", type: "page", description: "Virtual card details and management"})');
    
    // 4. Create API routes
    console.log('Creating API routes...');
    await session.run('CREATE (n:File:API {name: "route.ts", path: "/src/app/api/cards/route.ts", type: "api", description: "Virtual cards CRUD API"})');
    await session.run('CREATE (n:File:API {name: "route.ts", path: "/src/app/api/payment/intents/route.ts", type: "api", description: "Stripe payment intents API"})');
    await session.run('CREATE (n:File:API {name: "route.ts", path: "/src/app/api/webhooks/stripe/route.ts", type: "api", description: "Stripe webhook handler"})');
    
    // 5. Create utility files
    console.log('Creating utility files...');
    await session.run('CREATE (n:File:Utility {name: "stripeClient.ts", path: "/src/lib/stripe/stripeClient.ts", type: "utility", description: "Server-side Stripe client"})');
    await session.run('CREATE (n:File:Utility {name: "stripePublic.ts", path: "/src/lib/stripe/stripePublic.ts", type: "utility", description: "Client-side Stripe utilities"})');
    await session.run('CREATE (n:File:Doc {name: "STRIPE_DOCUMENTATION.md", path: "/src/lib/stripe/STRIPE_DOCUMENTATION.md", type: "documentation", description: "Consolidated Stripe documentation"})');
    
    // 6. Create stylesheets
    console.log('Creating stylesheets...');
    await session.run('CREATE (n:File:Style {name: "globals.css", path: "/src/app/globals.css", type: "stylesheet", description: "Global CSS styles"})');
    
    // 7. Create external dependencies
    console.log('Creating external dependencies...');
    await session.run('CREATE (n:ExternalDependency {name: "Stripe", version: "latest", description: "Payment processing platform"})');
    await session.run('CREATE (n:ExternalDependency {name: "React", version: "18", description: "UI library"})');
    await session.run('CREATE (n:ExternalDependency {name: "Next.js", version: "13", description: "React framework"})');
    
    // 8. Create directory relationships
    console.log('Creating directory relationships...');
    await session.run(`
      MATCH (src:Directory {name: "src"})
      MATCH (app:Directory {name: "app"})
      CREATE (src)-[:CONTAINS]->(app)
    `);
    
    await session.run(`
      MATCH (src:Directory {name: "src"})
      MATCH (components:Directory {name: "components"})
      CREATE (src)-[:CONTAINS]->(components)
    `);
    
    await session.run(`
      MATCH (src:Directory {name: "src"})
      MATCH (lib:Directory {name: "lib"})
      CREATE (src)-[:CONTAINS]->(lib)
    `);
    
    await session.run(`
      MATCH (lib:Directory {name: "lib"})
      MATCH (stripe:Directory {name: "stripe"})
      CREATE (lib)-[:CONTAINS]->(stripe)
    `);
    
    await session.run(`
      MATCH (components:Directory {name: "components"})
      MATCH (icons:Directory {name: "icons"})
      CREATE (components)-[:CONTAINS]->(icons)
    `);
    
    await session.run(`
      MATCH (app:Directory {name: "app"})
      MATCH (api:Directory {name: "api"})
      CREATE (app)-[:CONTAINS]->(api)
    `);
    
    // Add feature directories to app
    await session.run(`
      MATCH (app:Directory {name: "app"})
      MATCH (createBill:Directory {name: "create-bill"})
      MATCH (createGroup:Directory {name: "create-group"})
      MATCH (createCard:Directory {name: "create-virtual-card"})
      MATCH (cardDetails:Directory {name: "virtual-card-details"})
      CREATE (app)-[:CONTAINS]->(createBill)
      CREATE (app)-[:CONTAINS]->(createGroup)
      CREATE (app)-[:CONTAINS]->(createCard)
      CREATE (app)-[:CONTAINS]->(cardDetails)
    `);
    
    // Add API subdirectories
    await session.run(`
      MATCH (api:Directory {name: "api"})
      MATCH (cards:Directory {name: "cards"})
      MATCH (payment:Directory {name: "payment"})
      MATCH (webhooks:Directory {name: "webhooks"})
      CREATE (api)-[:CONTAINS]->(cards)
      CREATE (api)-[:CONTAINS]->(payment)
      CREATE (api)-[:CONTAINS]->(webhooks)
    `);
    
    await session.run(`
      MATCH (payment:Directory {name: "payment"})
      MATCH (intents:Directory {name: "intents"})
      CREATE (payment)-[:CONTAINS]->(intents)
    `);
    
    await session.run(`
      MATCH (webhooks:Directory {name: "webhooks"})
      MATCH (stripeWebhook:Directory {name: "stripe-webhook"})
      CREATE (webhooks)-[:CONTAINS]->(stripeWebhook)
    `);
    
    // 9. Create component relationships
    console.log('Creating component relationships...');
    await session.run(`
      MATCH (components:Directory {name: "components"})
      MATCH (header:Component {name: "Header"})
      MATCH (footer:Component {name: "Footer"})
      MATCH (hero:Component {name: "Hero"})
      MATCH (features:Component {name: "Features"})
      MATCH (howItWorks:Component {name: "HowItWorks"})
      MATCH (testimonials:Component {name: "Testimonials"})
      MATCH (cta:Component {name: "CTA"})
      CREATE (components)-[:CONTAINS]->(header)
      CREATE (components)-[:CONTAINS]->(footer)
      CREATE (components)-[:CONTAINS]->(hero)
      CREATE (components)-[:CONTAINS]->(features)
      CREATE (components)-[:CONTAINS]->(howItWorks)
      CREATE (components)-[:CONTAINS]->(testimonials)
      CREATE (components)-[:CONTAINS]->(cta)
    `);
    
    await session.run(`
      MATCH (icons:Directory {name: "icons"})
      MATCH (icon:Component {name: "Icon"})
      CREATE (icons)-[:CONTAINS]->(icon)
    `);
    
    // 10. Create file relationships
    console.log('Creating file relationships...');
    await session.run(`
      MATCH (app:Directory {name: "app"})
      MATCH (homepage:File {path: "/src/app/page.tsx"})
      MATCH (layout:File {path: "/src/app/layout.tsx"})
      MATCH (globals:File {path: "/src/app/globals.css"})
      CREATE (app)-[:CONTAINS]->(homepage)
      CREATE (app)-[:CONTAINS]->(layout)
      CREATE (app)-[:CONTAINS]->(globals)
    `);
    
    // Add pages to feature directories
    await session.run(`
      MATCH (createBill:Directory {name: "create-bill"})
      MATCH (createBillPage:File {path: "/src/app/create-bill/page.tsx"})
      CREATE (createBill)-[:CONTAINS]->(createBillPage)
    `);
    
    await session.run(`
      MATCH (createGroup:Directory {name: "create-group"})
      MATCH (createGroupPage:File {path: "/src/app/create-group/page.tsx"})
      CREATE (createGroup)-[:CONTAINS]->(createGroupPage)
    `);
    
    await session.run(`
      MATCH (createCard:Directory {name: "create-virtual-card"})
      MATCH (createCardPage:File {path: "/src/app/create-virtual-card/page.tsx"})
      CREATE (createCard)-[:CONTAINS]->(createCardPage)
    `);
    
    await session.run(`
      MATCH (cardDetails:Directory {name: "virtual-card-details"})
      MATCH (cardDetailsPage:File {path: "/src/app/virtual-card-details/page.tsx"})
      CREATE (cardDetails)-[:CONTAINS]->(cardDetailsPage)
    `);
    
    // Add API routes to their directories
    await session.run(`
      MATCH (cards:Directory {name: "cards"})
      MATCH (cardsApi:File {path: "/src/app/api/cards/route.ts"})
      CREATE (cards)-[:CONTAINS]->(cardsApi)
    `);
    
    await session.run(`
      MATCH (intents:Directory {name: "intents"})
      MATCH (intentsApi:File {path: "/src/app/api/payment/intents/route.ts"})
      CREATE (intents)-[:CONTAINS]->(intentsApi)
    `);
    
    await session.run(`
      MATCH (stripeWebhook:Directory {name: "stripe-webhook"})
      MATCH (webhookApi:File {path: "/src/app/api/webhooks/stripe/route.ts"})
      CREATE (stripeWebhook)-[:CONTAINS]->(webhookApi)
    `);
    
    // Add Stripe utilities to their directory
    await session.run(`
      MATCH (stripe:Directory {name: "stripe"})
      MATCH (stripeClient:File {path: "/src/lib/stripe/stripeClient.ts"})
      MATCH (stripePublic:File {path: "/src/lib/stripe/stripePublic.ts"})
      MATCH (stripeDoc:File {path: "/src/lib/stripe/STRIPE_DOCUMENTATION.md"})
      CREATE (stripe)-[:CONTAINS]->(stripeClient)
      CREATE (stripe)-[:CONTAINS]->(stripePublic)
      CREATE (stripe)-[:CONTAINS]->(stripeDoc)
    `);
    
    // 11. Create component imports for homepage
    console.log('Creating component imports...');
    await session.run(`
      MATCH (homepage:File {path: "/src/app/page.tsx"})
      MATCH (header:Component {name: "Header"})
      MATCH (footer:Component {name: "Footer"})
      MATCH (hero:Component {name: "Hero"})
      MATCH (features:Component {name: "Features"})
      MATCH (howItWorks:Component {name: "HowItWorks"})
      MATCH (testimonials:Component {name: "Testimonials"})
      MATCH (cta:Component {name: "CTA"})
      CREATE (homepage)-[:IMPORTS]->(header)
      CREATE (homepage)-[:IMPORTS]->(footer)
      CREATE (homepage)-[:IMPORTS]->(hero)
      CREATE (homepage)-[:IMPORTS]->(features)
      CREATE (homepage)-[:IMPORTS]->(howItWorks)
      CREATE (homepage)-[:IMPORTS]->(testimonials)
      CREATE (homepage)-[:IMPORTS]->(cta)
    `);
    
    // 12. Create component dependencies
    console.log('Creating component dependencies...');
    await session.run(`
      MATCH (features:Component {name: "Features"})
      MATCH (icon:Component {name: "Icon"})
      CREATE (features)-[:IMPORTS]->(icon)
    `);
    
    // 13. Create API dependencies
    console.log('Creating API dependencies...');
    await session.run(`
      MATCH (cardsApi:File {path: "/src/app/api/cards/route.ts"})
      MATCH (stripeClient:File {path: "/src/lib/stripe/stripeClient.ts"})
      MATCH (stripe:ExternalDependency {name: "Stripe"})
      CREATE (cardsApi)-[:IMPORTS]->(stripeClient)
      CREATE (cardsApi)-[:DEPENDS_ON]->(stripe)
    `);
    
    await session.run(`
      MATCH (intentsApi:File {path: "/src/app/api/payment/intents/route.ts"})
      MATCH (stripeClient:File {path: "/src/lib/stripe/stripeClient.ts"})
      MATCH (stripe:ExternalDependency {name: "Stripe"})
      CREATE (intentsApi)-[:IMPORTS]->(stripeClient)
      CREATE (intentsApi)-[:DEPENDS_ON]->(stripe)
    `);
    
    await session.run(`
      MATCH (webhookApi:File {path: "/src/app/api/webhooks/stripe/route.ts"})
      MATCH (stripeClient:File {path: "/src/lib/stripe/stripeClient.ts"})
      MATCH (stripe:ExternalDependency {name: "Stripe"})
      CREATE (webhookApi)-[:IMPORTS]->(stripeClient)
      CREATE (webhookApi)-[:DEPENDS_ON]->(stripe)
    `);
    
    // 14. Create page form relationships
    console.log('Creating form relationships...');
    await session.run(`
      MATCH (createBillPage:File {path: "/src/app/create-bill/page.tsx"})
      MATCH (intentsApi:File {path: "/src/app/api/payment/intents/route.ts"})
      CREATE (createBillPage)-[:CALLS_API]->(intentsApi)
    `);
    
    await session.run(`
      MATCH (createCardPage:File {path: "/src/app/create-virtual-card/page.tsx"})
      MATCH (cardsApi:File {path: "/src/app/api/cards/route.ts"})
      CREATE (createCardPage)-[:CALLS_API]->(cardsApi)
    `);
    
    await session.run(`
      MATCH (cardDetailsPage:File {path: "/src/app/virtual-card-details/page.tsx"})
      MATCH (cardsApi:File {path: "/src/app/api/cards/route.ts"})
      CREATE (cardDetailsPage)-[:CALLS_API]->(cardsApi)
    `);
    
    // 15. Create functional relationships
    console.log('Creating functional relationships...');
    await session.run(`
      MATCH (cardsApi:File {path: "/src/app/api/cards/route.ts"})
      MATCH (webhookApi:File {path: "/src/app/api/webhooks/stripe/route.ts"})
      CREATE (webhookApi)-[:UPDATES_DATA_FOR]->(cardsApi)
    `);
    
    // 16. Create framework dependencies
    console.log('Creating framework dependencies...');
    await session.run(`
      MATCH (reactDep:ExternalDependency {name: "React"})
      MATCH (nextDep:ExternalDependency {name: "Next.js"})
      MATCH (component:Component)
      CREATE (component)-[:DEPENDS_ON]->(reactDep)
      CREATE (component)-[:DEPENDS_ON]->(nextDep)
    `);
    
    // 17. Count the nodes and relationships
    console.log('Counting nodes and relationships...');
    const nodeResult = await session.run('MATCH (n) RETURN count(n) as count');
    const nodeCount = nodeResult.records[0].get('count').toNumber();
    
    const relResult = await session.run('MATCH ()-[r]->() RETURN count(r) as count');
    const relCount = relResult.records[0].get('count').toNumber();
    
    console.log(`Graph created successfully with ${nodeCount} nodes and ${relCount} relationships!`);
    
    return { nodes: nodeCount, relationships: relCount };
  } catch (error) {
    console.error('Error creating graph:', error);
    return null;
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the function
createEnhancedGraph()
  .then(result => {
    if (result) {
      console.log('SUCCESS! Enhanced Neo4j graph model is ready to use as a context window.');
      console.log('To visualize it, go to https://browser.neo4j.io/ and connect with your credentials.');
      console.log('Then run: MATCH (n) RETURN n LIMIT 25');
      console.log('\nFor exploring the full structure, try these queries:');
      console.log('- MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 50');
      console.log('- MATCH path = (:File {path: "/src/app/page.tsx"})-[:IMPORTS]->() RETURN path');
      console.log('- MATCH path = (:File)-[:CALLS_API]->(:File) RETURN path');
    } else {
      console.log('Failed to create the enhanced graph model.');
    }
  })
  .catch(error => console.error('Unhandled error:', error));
