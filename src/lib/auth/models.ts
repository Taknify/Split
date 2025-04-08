import bcrypt from 'bcryptjs';
import { executeQuery } from '../neo4j';

// User model for Neo4j
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
}

// Create a user in Neo4j
export async function createUser(userData: Omit<User, 'id'>) {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password || '', salt);
  
  // Create user in Neo4j
  const cypher = `
    CREATE (u:User {
      id: randomUUID(),
      name: $name,
      email: $email,
      password: $password,
      image: $image,
      emailVerified: $emailVerified,
      createdAt: datetime()
    })
    RETURN u
  `;
  
  const params = {
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    image: userData.image || null,
    emailVerified: userData.emailVerified ? userData.emailVerified.toISOString() : null
  };
  
  const result = await executeQuery(cypher, params);
  return result[0].u.properties;
}

// Find user by email
export async function getUserByEmail(email: string) {
  const cypher = `
    MATCH (u:User)
    WHERE u.email = $email
    RETURN u
  `;
  
  const result = await executeQuery(cypher, { email: email.toLowerCase() });
  return result.length > 0 ? result[0].u.properties : null;
}

// Find user by ID
export async function getUserById(id: string) {
  const cypher = `
    MATCH (u:User)
    WHERE u.id = $id
    RETURN u
  `;
  
  const result = await executeQuery(cypher, { id });
  return result.length > 0 ? result[0].u.properties : null;
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

// Update user
export async function updateUser(id: string, userData: Partial<User>) {
  let setValues = '';
  const params: Record<string, any> = { id };
  
  // Build dynamic SET clause
  Object.entries(userData).forEach(([key, value], index) => {
    if (key !== 'id' && value !== undefined) {
      const paramKey = `param${index}`;
      setValues += `${index > 0 ? ', ' : ''}u.${key} = $${paramKey}`;
      params[paramKey] = value;
    }
  });
  
  if (!setValues) return null; // No properties to update
  
  const cypher = `
    MATCH (u:User)
    WHERE u.id = $id
    SET ${setValues}
    RETURN u
  `;
  
  const result = await executeQuery(cypher, params);
  return result.length > 0 ? result[0].u.properties : null;
}