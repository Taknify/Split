#!/bin/bash

# SplitApp setup script

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print with color
print_colored() {
  echo -e "${2}${1}${NC}"
}

# Create .env.local from example if it doesn't exist
setup_env() {
  print_colored "Setting up environment..." $BLUE
  
  if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
      cp .env.local.example .env.local
      print_colored "✅ Created .env.local from example" $GREEN
      print_colored "⚠️ Please update the environment variables in .env.local with your actual values!" $YELLOW
    else
      print_colored "❌ .env.local.example not found" $RED
      return 1
    fi
  else
    print_colored "✅ .env.local already exists" $GREEN
  fi
  
  return 0
}

# Install dependencies
install_dependencies() {
  print_colored "Installing dependencies..." $BLUE
  
  npm install
  
  if [ $? -eq 0 ]; then
    print_colored "✅ Dependencies installed successfully" $GREEN
    return 0
  else
    print_colored "❌ Failed to install dependencies" $RED
    return 1
  fi
}

# Check Neo4j Connection
check_neo4j() {
  print_colored "Checking Neo4j connection..." $BLUE
  
  if command -v nc >/dev/null 2>&1; then
    # Extract host and port from NEO4J_URI in .env.local
    if [ -f .env.local ]; then
      URI=$(grep NEO4J_URI .env.local | cut -d '=' -f2)
      HOST=$(echo $URI | sed -n 's/.*bolt:\/\/\([^:]*\).*/\1/p')
      PORT=$(echo $URI | sed -n 's/.*:\([0-9]*\).*/\1/p')
      
      if [ -z "$HOST" ]; then HOST="localhost"; fi
      if [ -z "$PORT" ]; then PORT="7687"; fi
      
      nc -z -w 5 $HOST $PORT >/dev/null 2>&1
      if [ $? -eq 0 ]; then
        print_colored "✅ Neo4j is running at $HOST:$PORT" $GREEN
      else
        print_colored "❌ Neo4j is not running at $HOST:$PORT" $RED
        print_colored "Please start your Neo4j database before proceeding." $YELLOW
        return 1
      fi
    else
      print_colored "❓ Cannot check Neo4j connection: .env.local not found" $YELLOW
    fi
  else
    print_colored "❓ Cannot check Neo4j connection: 'nc' command not available" $YELLOW
  fi
  
  return 0
}

# Seed the database
seed_database() {
  print_colored "Would you like to seed the database with test data? (y/n)" $BLUE
  read -r answer
  
  if [[ "$answer" =~ ^[Yy]$ ]]; then
    print_colored "Seeding database..." $BLUE
    npm run seed-db
    
    if [ $? -eq 0 ]; then
      print_colored "✅ Database seeded successfully" $GREEN
      print_colored "You can now login with:" $GREEN
      print_colored "- User 1: john@example.com / password123 (Admin)" $GREEN
      print_colored "- User 2: jane@example.com / password123" $GREEN
      return 0
    else
      print_colored "❌ Failed to seed database" $RED
      return 1
    fi
  else
    print_colored "Skipping database seeding" $YELLOW
  fi
  
  return 0
}

# Run setup
main() {
  print_colored "=== SplitApp Setup ===" $BLUE
  
  setup_env && install_dependencies && check_neo4j && seed_database
  
  if [ $? -eq 0 ]; then
    print_colored "\n✅ Setup completed successfully!" $GREEN
    print_colored "Run 'npm run dev' to start the development server." $GREEN
  else
    print_colored "\n❌ Setup failed" $RED
  fi
}

# Run main function
main