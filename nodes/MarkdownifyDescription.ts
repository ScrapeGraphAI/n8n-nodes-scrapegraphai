import type { INodeProperties } from 'n8n-workflow';

export const markdownifyOperations: INodeProperties[] = [];

export const markdownifyFields: INodeProperties[] = [
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