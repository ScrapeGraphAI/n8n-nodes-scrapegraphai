import type { INodeProperties } from 'n8n-workflow';

export const schemaGeneratorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['schemagenerator'],
			},
		},
		options: [
			{
				name: 'Generate Schema',
				value: 'generateSchema',
				action: 'Generate JSON schema from natural language description',
				description: 'Generate or modify JSON schemas based on natural language descriptions',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				action: 'Get schema generation status',
				description: 'Retrieve the status and results of a schema generation request',
			},
		],
		default: 'generateSchema',
	},
];

export const schemaGeneratorFields: INodeProperties[] = [
	{
		displayName: 'User Prompt',
		name: 'userPrompt',
		type: 'string',
		required: true,
		default: '',
		typeOptions: {
			rows: 3,
		},
		placeholder: 'Create a schema for product information including name, price, and reviews',
		description: 'Natural language description of desired schema',
		displayOptions: {
			show: {
				resource: ['schemagenerator'],
				operation: ['generateSchema'],
			},
		},
	},
	{
		displayName: 'Use Existing Schema',
		name: 'useExistingSchema',
		type: 'boolean',
		default: false,
		description: 'Whether to modify or extend an existing schema',
		displayOptions: {
			show: {
				resource: ['schemagenerator'],
				operation: ['generateSchema'],
			},
		},
	},
	{
		displayName: 'Existing Schema',
		name: 'existingSchema',
		type: 'json',
		required: true,
		default: '{}',
		description: 'Existing schema to modify or extend',
		displayOptions: {
			show: {
				resource: ['schemagenerator'],
				operation: ['generateSchema'],
				useExistingSchema: [true],
			},
		},
	},
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique request identifier',
		displayOptions: {
			show: {
				resource: ['schemagenerator'],
				operation: ['getStatus'],
			},
		},
	},
];
