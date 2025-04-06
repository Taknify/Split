// Neo4j Cypher script to create a graph representation of the Next.js codebase
// This will model files, components, imports, and their relationships

// Clear existing data (be careful with this in production!)
MATCH (n) DETACH DELETE n;

// Create File nodes for different file types
// App structure files
CREATE (layout:File {name: 'layout.tsx', path: '/src/app/layout.tsx', type: 'layout'})
CREATE (globals:File {name: 'globals.css', path: '/src/app/globals.css', type: 'stylesheet'})
CREATE (homepage:File {name: 'page.tsx', path: '/src/app/page.tsx', type: 'page'})

// Component files
CREATE (header:Component {name: 'Header', path: '/src/components/Header.tsx', type: 'component'})
CREATE (hero:Component {name: 'Hero', path: '/src/components/Hero.tsx', type: 'component'})
CREATE (features:Component {name: 'Features', path: '/src/components/Features.tsx', type: 'component'})
CREATE (howItWorks:Component {name: 'HowItWorks', path: '/src/components/HowItWorks.tsx', type: 'component'})
CREATE (testimonials:Component {name: 'Testimonials', path: '/src/components/Testimonials.tsx', type: 'component'})
CREATE (cta:Component {name: 'CTA', path: '/src/components/CTA.tsx', type: 'component'})
CREATE (footer:Component {name: 'Footer', path: '/src/components/Footer.tsx', type: 'component'})

// API Routes
CREATE (cardsApi:File {name: 'route.ts', path: '/src/app/api/cards/route.ts', type: 'api'})
CREATE (paymentIntentsApi:File {name: 'route.ts', path: '/src/app/api/payment/intents/route.ts', type: 'api'})
CREATE (stripeWebhookApi:File {name: 'route.ts', path: '/src/app/api/webhooks/stripe/route.ts', type: 'api'})

// Page files
CREATE (createBillPage:File {name: 'page.tsx', path: '/src/app/create-bill/page.tsx', type: 'page'})
CREATE (createGroupPage:File {name: 'page.tsx', path: '/src/app/create-group/page.tsx', type: 'page'})
CREATE (createVirtualCardPage:File {name: 'page.tsx', path: '/src/app/create-virtual-card/page.tsx', type: 'page'})
CREATE (virtualCardDetailsPage:File {name: 'page.tsx', path: '/src/app/virtual-card-details/page.tsx', type: 'page'})

// Data files
CREATE (sampleData:File {name: 'sample-data.json', path: '/src/data/sample-data.json', type: 'data'})

// Create directories as nodes
CREATE (app:Directory {name: 'app', path: '/src/app'})
CREATE (api:Directory {name: 'api', path: '/src/app/api'})
CREATE (components:Directory {name: 'components', path: '/src/components'})
CREATE (data:Directory {name: 'data', path: '/src/data'})
CREATE (lib:Directory {name: 'lib', path: '/src/lib'})
CREATE (stripe:Directory {name: 'stripe', path: '/src/lib/stripe'})

// Create relationships for directory structure
CREATE (app)-[:CONTAINS]->(layout)
CREATE (app)-[:CONTAINS]->(globals)
CREATE (app)-[:CONTAINS]->(homepage)
CREATE (app)-[:CONTAINS]->(api)
CREATE (api)-[:CONTAINS]->(cardsApi)
CREATE (api)-[:CONTAINS]->(paymentIntentsApi)
CREATE (api)-[:CONTAINS]->(stripeWebhookApi)
CREATE (app)-[:CONTAINS]->(createBillPage)
CREATE (app)-[:CONTAINS]->(createGroupPage)
CREATE (app)-[:CONTAINS]->(createVirtualCardPage)
CREATE (app)-[:CONTAINS]->(virtualCardDetailsPage)
CREATE (components)-[:CONTAINS]->(header)
CREATE (components)-[:CONTAINS]->(hero)
CREATE (components)-[:CONTAINS]->(features)
CREATE (components)-[:CONTAINS]->(howItWorks)
CREATE (components)-[:CONTAINS]->(testimonials)
CREATE (components)-[:CONTAINS]->(cta)
CREATE (components)-[:CONTAINS]->(footer)
CREATE (data)-[:CONTAINS]->(sampleData)
CREATE (lib)-[:CONTAINS]->(stripe)

// Create relationships for imports
CREATE (homepage)-[:IMPORTS]->(header)
CREATE (homepage)-[:IMPORTS]->(hero)
CREATE (homepage)-[:IMPORTS]->(features)
CREATE (homepage)-[:IMPORTS]->(howItWorks)
CREATE (homepage)-[:IMPORTS]->(testimonials)
CREATE (homepage)-[:IMPORTS]->(cta)
CREATE (homepage)-[:IMPORTS]->(footer)

// Create semantic relationships based on function
CREATE (header)-[:PART_OF {section: 'navigation'}]->(homepage)
CREATE (hero)-[:PART_OF {section: 'main'}]->(homepage)
CREATE (features)-[:PART_OF {section: 'main'}]->(homepage)
CREATE (howItWorks)-[:PART_OF {section: 'main'}]->(homepage)
CREATE (testimonials)-[:PART_OF {section: 'social_proof'}]->(homepage)
CREATE (cta)-[:PART_OF {section: 'conversion'}]->(homepage)
CREATE (footer)-[:PART_OF {section: 'navigation'}]->(homepage)

// Create API relationships
CREATE (cardsApi)-[:HANDLES {action: 'create_card', method: 'POST'}]->(createVirtualCardPage)
CREATE (cardsApi)-[:HANDLES {action: 'get_cards', method: 'GET'}]->(virtualCardDetailsPage)
CREATE (paymentIntentsApi)-[:HANDLES {action: 'create_payment_intent', method: 'POST'}]->(createBillPage)
CREATE (stripeWebhookApi)-[:PROCESSES {event: 'payment_success'}]->(paymentIntentsApi)

// Add specific dependency relationships (would be more in a real codebase)
CREATE (cardsApi)-[:DEPENDS_ON {type: 'external'}]->(:ExternalDependency {name: 'Stripe', version: '2023-10-16'})

// Add tags for better categorization and context understanding
MATCH (n:File) WHERE n.path CONTAINS 'api' SET n:API
MATCH (n:File) WHERE n.type = 'page' SET n:Page
MATCH (n:Component) SET n:React, n:UI

// Add AST-like relationships for component structure (simplified)
// Header component has UI elements
CREATE (headerTitle:UIElement {name: 'title', type: 'text', value: 'SplitApp'})
CREATE (headerNav:UIElement {name: 'navigation', type: 'menu'})
CREATE (headerMobileMenu:UIElement {name: 'mobileMenu', type: 'menu', conditional: 'isMenuOpen'})
CREATE (header)-[:CONTAINS_ELEMENT]->(headerTitle)
CREATE (header)-[:CONTAINS_ELEMENT]->(headerNav)
CREATE (header)-[:CONTAINS_ELEMENT]->(headerMobileMenu)
CREATE (headerNav)-[:HAS_STATE {name: 'isMenuOpen', type: 'boolean', default: 'false'}]->(header)

// Query examples (for reference):

// 1. Find all files that the homepage imports
// MATCH (p:File {name: 'page.tsx', path: '/src/app/page.tsx'})-[:IMPORTS]->(c) RETURN p, c

// 2. Get the entire component tree of the homepage
// MATCH path = (p:File {name: 'page.tsx', path: '/src/app/page.tsx'})-[:IMPORTS|PART_OF*]->(c) RETURN path

// 3. Find all API endpoints that handle POST requests
// MATCH (a:API)-[r:HANDLES]->(p) WHERE r.method = 'POST' RETURN a, r, p

// 4. Find all components with UI elements
// MATCH (c:Component)-[:CONTAINS_ELEMENT]->(e:UIElement) RETURN c, e

// 5. Find components with state
// MATCH (e)-[:HAS_STATE]->(c:Component) RETURN c, e
