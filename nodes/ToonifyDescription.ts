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
				name: 'Convert to TOON',
				value: 'convert',
				action: 'Convert JSON data to TOON format',
				description: 'Serialize structured data to TOON (Token-Oriented Object Notation) format to reduce LLM token usage by 30-60%',
			},
		],
		default: 'convert',
	},
];

export const toonifyFields: INodeProperties[] = [
	{
		displayName: 'JSON Data',
		name: 'jsonPayload',
		type: 'json',
		required: true,
		default: '{\n  "products": [\n    {\n      "sku": "LAP-001",\n      "name": "Gaming Laptop",\n      "price": 1299.99\n    },\n    {\n      "sku": "MOU-042",\n      "name": "Wireless Mouse",\n      "price": 29.99\n    }\n  ]\n}',
		description: 'JSON data to convert to TOON format. TOON (Token-Oriented Object Notation) is a compact serialization format that reduces token usage by 30-60% compared to JSON while maintaining readability.',
		displayOptions: {
			show: {
				resource: ['toonify'],
				operation: ['convert'],
			},
		},
		typeOptions: {
			rows: 10,
		},
	},
];
