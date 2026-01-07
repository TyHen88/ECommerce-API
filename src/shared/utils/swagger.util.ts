import { z } from 'zod';

export interface RouteDefinition {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  tags: string[];
  summary: string;
  description?: string;
  security?: Array<{ bearerAuth: [] }>;
  requestBody?: z.ZodSchema;
  parameters?: {
    path?: z.ZodSchema;
    query?: z.ZodSchema;
  };
  responses: {
    [statusCode: string]: {
      description: string;
      schema?: z.ZodSchema;
    };
  };
}

export function convertZodToOpenApiSchema(schema: z.ZodSchema): any {
  // For now, we'll use a simplified approach that works with our specific schemas
  // This can be enhanced later with more sophisticated conversion
  
  try {
    // Handle basic cases that we know work
    const def = (schema as any)._def;
    
    if (def.typeName === 'ZodObject') {
      const properties: any = {};
      const required: string[] = [];
      
      if (def.shape) {
        Object.entries(def.shape()).forEach(([key, value]: [string, any]) => {
          const valueDef = value._def;
          
          // Basic type mapping
          switch (valueDef.typeName) {
            case 'ZodString':
              properties[key] = { 
                type: 'string',
                description: valueDef.description
              };
              break;
            case 'ZodNumber':
              properties[key] = { 
                type: 'number',
                description: valueDef.description
              };
              break;
            case 'ZodArray':
              properties[key] = { 
                type: 'array',
                items: { type: 'object' },
                description: valueDef.description
              };
              break;
            case 'ZodOptional':
              // Handle optional fields
              const innerType = convertZodToOpenApiSchema(valueDef.innerType);
              properties[key] = { 
                ...innerType,
                description: valueDef.description
              };
              break;
            default:
              properties[key] = { 
                type: 'string',
                description: valueDef.description || `Field: ${key}`
              };
          }
          
          // Add to required if not optional
          if (valueDef.typeName !== 'ZodOptional') {
            required.push(key);
          }
        });
      }
      
      return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined
      };
    }
    
    // Fallback for other types
    return { type: 'object' };
  } catch (error) {
    // Ultimate fallback
    return { type: 'object' };
  }
}

export function generateOpenApiPaths(routes: RouteDefinition[]): any {
  const paths: any = {};

  routes.forEach(route => {
    if (!paths[route.path]) {
      paths[route.path] = {};
    }

    const operation: any = {
      tags: route.tags,
      summary: route.summary,
      responses: {}
    };

    if (route.description) {
      operation.description = route.description;
    }

    if (route.security) {
      operation.security = route.security;
    }

    // Add request body if present
    if (route.requestBody) {
      operation.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: convertZodToOpenApiSchema(route.requestBody)
          }
        }
      };
    }

    // Add parameters if present (simplified approach for now)
    if (route.parameters) {
      operation.parameters = [];
      
      if (route.parameters.path) {
        // For now, we'll manually define common path parameters
        // This could be enhanced later with more sophisticated parsing
        operation.parameters.push({
          name: 'id',
          in: 'path',
          required: true,
          description: 'Resource ID',
          schema: { type: 'string' }
        });
      }

      if (route.parameters.query) {
        // Query parameters would be added here similarly
        // For now, we'll leave this empty as our routes don't use query params
      }
    }

    // Add responses
    Object.entries(route.responses).forEach(([statusCode, response]) => {
      operation.responses[statusCode] = {
        description: response.description
      };
      
      if (response.schema) {
        operation.responses[statusCode].content = {
          'application/json': {
            schema: convertZodToOpenApiSchema(response.schema)
          }
        };
      }
    });

    paths[route.path][route.method] = operation;
  });

  return paths;
}

export function generateOpenApiDocument(routes: RouteDefinition[]) {
  return {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'Production-ready E-commerce REST API with Node.js, Express, TypeScript, and Prisma',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: generateOpenApiPaths(routes),
  };
}