import type { INodeProperties, IDataObject } from 'n8n-workflow';

export function makeOutputModeField(resource: string, operation: string[]): INodeProperties[] {
	return [
		{
			displayName: 'Output',
			name: 'outputMode',
			type: 'options',
			default: 'simplified',
			description: 'Shape of the response returned by this operation',
			displayOptions: { show: { resource: [resource], operation } },
			options: [
				{
					name: 'Simplified',
					value: 'simplified',
					description: 'Flatten the response down to the most useful top-level fields',
				},
				{
					name: 'Raw',
					value: 'raw',
					description: 'Return the full API response unchanged',
				},
				{
					name: 'Selected Fields',
					value: 'selected',
					description: 'Return only a chosen subset of top-level fields',
				},
			],
		},
		{
			displayName: 'Fields',
			name: 'outputFields',
			type: 'string',
			default: 'id,json',
			placeholder: 'e.g. ID,json,usage',
			description: 'Comma-separated list of top-level fields to keep in the output',
			displayOptions: {
				show: { resource: [resource], operation, outputMode: ['selected'] },
			},
		},
	];
}

const SIMPLIFY_KEYS = [
	'id',
	'json',
	'results',
	'raw',
	'data',
	'usage',
	'metadata',
	'remaining',
	'used',
	'plan',
	'jobs',
	'cronId',
	'status',
];

export function applyOutputMode(
	mode: string,
	fieldsCsv: string,
	raw: unknown,
): IDataObject {
	if (raw === null || typeof raw !== 'object') return { value: raw } as IDataObject;
	const obj = raw as IDataObject;

	if (mode === 'raw') return obj;

	if (mode === 'selected') {
		const fields = fieldsCsv
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const out: IDataObject = {};
		for (const f of fields) if (f in obj) out[f] = obj[f];
		return out;
	}

	const out: IDataObject = {};
	for (const k of SIMPLIFY_KEYS) if (k in obj) out[k] = obj[k];
	return Object.keys(out).length > 0 ? out : obj;
}
