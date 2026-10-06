import { PART_CATEGORIES } from '#config';

// served at /api-docs
const bearer = [{ bearerAuth: [] }];
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'string' } };
const json = (ref: string) => ({ 'application/json': { schema: { $ref: `#/components/schemas/${ref}` } } });
const error = (description: string) => ({ description, content: json('Error') });

export const openapiDoc = {
  openapi: '3.0.3',
  info: {
    title: 'DiagBay API',
    version: '1.0.0',
    description: 'REST API of the WBS final project. Log in, copy the token and click "Authorize".'
  },
  servers: [{ url: '/api' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Error: { type: 'object', properties: { message: { type: 'string' } } },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['technician', 'admin'] }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: { token: { type: 'string' }, user: { $ref: '#/components/schemas/User' } }
      },
      RegisterBody: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Sam Technician' },
          email: { type: 'string', example: 'sam@workshop.dev' },
          password: { type: 'string', example: 'secret123' }
        }
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'tech@diagbay.dev' },
          password: { type: 'string', example: 'Tech1234!' }
        }
      },
      PartInput: {
        type: 'object',
        required: ['partNumber', 'name', 'category', 'price'],
        properties: {
          partNumber: { type: 'string', example: 'BRK-1099' },
          name: { type: 'string', example: 'Front brake pad set, ceramic' },
          category: { type: 'string', enum: PART_CATEGORIES },
          description: { type: 'string' },
          compatibilityNote: { type: 'string', example: 'Compact cars 2015-2022' },
          price: { type: 'number', example: 49.9 }
        }
      },
      Part: {
        allOf: [
          { $ref: '#/components/schemas/PartInput' },
          {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              createdBy: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        ]
      },
      DiagnosisRequest: {
        type: 'object',
        required: ['symptomDescription'],
        properties: {
          symptomDescription: {
            type: 'string',
            minLength: 10,
            maxLength: 1000,
            example: 'Grinding noise from the front when braking, pedal feels soft'
          },
          vehicleNote: { type: 'string', maxLength: 200, example: 'Compact hatchback, 2017, 120,000 km' }
        }
      },
      DiagnosisResult: {
        type: 'object',
        properties: {
          subsystem: { type: 'string' },
          possibleCauses: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
          recommendedPartCategories: { type: 'array', items: { type: 'string', enum: PART_CATEGORIES } },
          urgency: { type: 'string', enum: ['low', 'medium', 'high'] },
          confidence: { type: 'number', minimum: 0, maximum: 1 }
        }
      },
      Diagnosis: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          symptomDescription: { type: 'string' },
          vehicleNote: { type: 'string' },
          result: { $ref: '#/components/schemas/DiagnosisResult' },
          source: { type: 'string', enum: ['ai', 'mock'] },
          owner: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create a technician account',
        requestBody: { required: true, content: json('RegisterBody') },
        responses: { 201: { description: 'Created', content: json('AuthResponse') }, 400: error('Validation error'), 409: error('Email exists') }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in and receive a JWT',
        requestBody: { required: true, content: json('LoginBody') },
        responses: { 200: { description: 'OK', content: json('AuthResponse') }, 401: error('Wrong credentials') }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Current user (restores the session after a refresh)',
        security: bearer,
        responses: { 200: { description: 'OK' }, 401: error('Not logged in') }
      }
    },
    '/parts': {
      get: {
        tags: ['Parts'],
        summary: 'List and search parts',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string', enum: PART_CATEGORIES } }
        ],
        responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Part' } } } } } }
      },
      post: {
        tags: ['Parts'],
        summary: 'Create a part (admin)',
        security: bearer,
        requestBody: { required: true, content: json('PartInput') },
        responses: { 201: { description: 'Created', content: json('Part') }, 400: error('Validation error'), 401: error('Not logged in'), 403: error('Not admin'), 409: error('Duplicate part number') }
      }
    },
    '/parts/categories': {
      get: { tags: ['Parts'], summary: 'All part categories', responses: { 200: { description: 'OK' } } }
    },
    '/parts/{id}': {
      parameters: [idParam],
      get: { tags: ['Parts'], summary: 'One part', responses: { 200: { description: 'OK', content: json('Part') }, 404: error('Not found') } },
      put: {
        tags: ['Parts'],
        summary: 'Update a part (admin)',
        security: bearer,
        requestBody: { required: true, content: json('PartInput') },
        responses: { 200: { description: 'OK', content: json('Part') }, 403: error('Not admin'), 404: error('Not found') }
      },
      delete: { tags: ['Parts'], summary: 'Delete a part (admin)', security: bearer, responses: { 204: { description: 'Deleted' }, 403: error('Not admin'), 404: error('Not found') } }
    },
    '/diagnoses': {
      post: {
        tags: ['Diagnoses'],
        summary: 'Run the AI diagnosis and save it',
        security: bearer,
        requestBody: { required: true, content: json('DiagnosisRequest') },
        responses: {
          201: { description: 'Created', content: json('Diagnosis') },
          400: error('Validation error'),
          401: error('Not logged in'),
          429: error('Rate limit'),
          502: error('AI failed after retry, nothing saved')
        }
      },
      get: { tags: ['Diagnoses'], summary: 'My diagnoses, newest first', security: bearer, responses: { 200: { description: 'OK' } } }
    },
    '/diagnoses/{id}': {
      parameters: [idParam],
      get: { tags: ['Diagnoses'], summary: 'One of my diagnoses', security: bearer, responses: { 200: { description: 'OK', content: json('Diagnosis') }, 403: error('Not the owner'), 404: error('Not found') } },
      delete: { tags: ['Diagnoses'], summary: 'Delete one of my diagnoses', security: bearer, responses: { 204: { description: 'Deleted' }, 403: error('Not the owner'), 404: error('Not found') } }
    }
  }
};
