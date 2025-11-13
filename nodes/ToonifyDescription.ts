import type { INodeProperties } from 'n8n-workflow';

export const toonifyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['toonify'],
			},
		},
		options: [
			{
				name: 'Convert',
				value: 'convert',
				action: 'Convert image to toon/cartoon style',
				description: 'Apply toonification effect to convert an image to cartoon/toon style',
			},
		],
		default: 'convert',
	},
];

export const toonifyFields: INodeProperties[] = [
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'URL of the image to convert to toon/cartoon style',
		displayOptions: {
			show: {
				resource: ['toonify'],
				operation: ['convert'],
			},
		},
	},
];
