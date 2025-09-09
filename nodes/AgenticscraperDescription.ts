import type { INodeProperties } from 'n8n-workflow';

export const agenticscraperOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
			},
		},
		options: [
			{
				name: 'Execute',
				value: 'execute',
				action: 'Execute browser automation steps with optional AI extraction',
				description: 'Perform browser interactions like clicking, typing, and navigating, with optional AI-powered data extraction',
			},
		],
		default: 'execute',
	},
];

export const agenticscraperFields: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'The target webpage URL to interact with',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['execute'],
			},
		},
	},
	{
		displayName: 'Steps',
		name: 'steps',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Step',
		},
		placeholder: 'Add Step',
		default: { step: [{ action: '' }] },
		required: true,
		description: 'Browser interaction steps to perform (at least one step is required)',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['execute'],
			},
		},
		options: [
			{
				name: 'step',
				displayName: 'Step',
				values: [
					{
						displayName: 'Action',
						name: 'action',
						type: 'string',
						default: '',
						placeholder: 'e.g., Click on login button',
					},
				],
			},
		],
	},
	{
		displayName: 'Use Session',
		name: 'useSession',
		type: 'boolean',
		default: false,
		description: 'Whether to maintain browser session across multiple requests',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['execute'],
			},
		},
	},
	{
		displayName: 'Enable AI Extraction',
		name: 'aiExtraction',
		type: 'boolean',
		default: true,
		description: 'Whether to enable AI-powered data extraction from the page',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['execute'],
			},
		},
	},
	{
		displayName: 'User Prompt',
		name: 'userPrompt',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 3,
		},
		placeholder: 'Extract user info, dashboard sections, and remaining credits',
		description: 'Instructions for what data to extract from the page',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['execute'],
				aiExtraction: [true],
			},
		},
	},
	{
		displayName: 'Use Custom Output Schema',
		name: 'useOutputSchema',
		type: 'boolean',
		default: false,
		description: 'Whether to define a custom JSON schema for structured output',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['execute'],
				aiExtraction: [true],
			},
		},
	},
	{
		displayName: 'Output Schema',
		name: 'outputSchema',
		type: 'json',
		required: true,
		default: '{\n  "dashboard_info": {\n    "type": "object",\n    "properties": {\n      "username": {\n        "type": "string"\n      },\n      "email": {\n        "type": "string"\n      },\n      "dashboard_sections": {\n        "type": "array",\n        "items": {\n          "type": "string"\n        }\n      },\n      "credits_remaining": {\n        "type": "number"\n      }\n    },\n    "required": ["username", "dashboard_sections"]\n  }\n}',
		description: 'JSON schema to structure the extracted data. Define properties with types and descriptions.',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['execute'],
				aiExtraction: [true],
				useOutputSchema: [true],
			},
		},
	},
];