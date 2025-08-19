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
				name: 'Automate',
				value: 'automate',
				action: 'AI-powered browser automation with custom steps • 15 credits per request',
				description: 'AI-powered browser automation with custom steps • 15 credits per request',
			},
		],
		default: 'automate',
	},
];

export const agenticscraperFields: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		description: 'URL of the website to interact with',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['automate'],
			},
		},
	},
	{
		displayName: 'Use Session',
		name: 'useSession',
		type: 'boolean',
		default: true,
		description: 'Whether to maintain session state across interactions',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['automate'],
			},
		},
	},
	{
		displayName: 'Steps',
		name: 'steps',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {
			stepItems: [
				{
					step: '',
				},
			],
		},
		description: 'List of automation steps to perform',
		displayOptions: {
			show: {
				resource: ['agenticscraper'],
				operation: ['automate'],
			},
		},
		options: [
			{
				displayName: 'Step Items',
				name: 'stepItems',
				values: [
					{
						displayName: 'Step',
						name: 'step',
						type: 'string',
						default: '',
						required: true,
						description: 'Automation step description (e.g., "Type email@gmail.com in email input box")',
						placeholder: 'Type email@gmail.com in email input box',
					},
				],
			},
		],
	},
];
