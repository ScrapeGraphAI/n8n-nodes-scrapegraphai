import type { INodeProperties } from 'n8n-workflow';

export const markdownifyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['markdownify'],
			},
		},
		options: [
			{
				name: 'Convert',
				value: 'convert',
				action: 'Convert a webpage or article to clean markdown useful for blogs dev docs and more',
				description: 'Convert a webpage or article to clean markdown – useful for blogs, dev docs and more',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				action: 'Get the status and results of a conversion',
				description: 'Retrieve the status and results of a markdown conversion by request ID',
			},
		],
		default: 'convert',
	},
];

export const markdownifyFields: INodeProperties[] = [
	// Fields for getStatus operation
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		description: 'The request ID returned from a convert operation',
		displayOptions: {
			show: {
				resource: ['markdownify'],
				operation: ['getStatus'],
			},
		},
	},
	// Fields for convert operation
	{
		displayName: 'Website URL',
		name: 'websiteUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'URL of the website to convert to markdown',
		displayOptions: {
			show: {
				resource: ['markdownify'],
				operation: ['convert'],
			},
		},
	},
	{
		displayName: 'Render Heavy JS',
		name: 'renderHeavyJs',
		type: 'boolean',
		default: false,
		description: 'Whether to render JavaScript-heavy websites (additional credits will be charged)',
		displayOptions: {
			show: {
				resource: ['markdownify'],
				operation: ['convert'],
			},
		},
	},
]; 