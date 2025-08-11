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
				action: 'Turn any webpage or article into clean markdown – Useful for blogs, dev docs and more',
			},
		],
		default: 'convert',
	},
];

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
				operation: ['convert'],
			},
		},
	},
]; 