import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get Credits',
				value: 'getCredits',
				action: 'Get user credit information',
				description: 'Retrieve the current credit balance and usage for the authenticated user',
			},
			{
				name: 'Validate API Key',
				value: 'validateApiKey',
				action: 'Validate API key',
				description: 'Validate the API key and retrieve associated user email',
			},
			{
				name: 'Submit Feedback',
				value: 'submitFeedback',
				action: 'Submit feedback',
				description: 'Submit feedback for a specific request',
			},
		],
		default: 'getCredits',
	},
];

export const userFields: INodeProperties[] = [
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		description: 'Request to provide feedback for',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['submitFeedback'],
			},
		},
	},
	{
		displayName: 'Rating',
		name: 'rating',
		type: 'number',
		required: true,
		default: 5,
		typeOptions: {
			minValue: 0,
			maxValue: 5,
		},
		description: 'Rating score (0-5)',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['submitFeedback'],
			},
		},
	},
	{
		displayName: 'Feedback Text',
		name: 'feedbackText',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 3,
		},
		description: 'Optional feedback comments',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['submitFeedback'],
			},
		},
	},
];
