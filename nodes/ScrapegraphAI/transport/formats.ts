import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { parseJsonObject } from './request';

export function makeFormatsField(resource: string, operation: string[]): INodeProperties {
	return {
		displayName: 'Formats',
		name: 'formats',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Format',
		default: { format: [{ type: 'markdown' }] },
		description: 'Output formats to capture for the page',
		displayOptions: { show: { resource: [resource], operation } },
		options: [
			{
				name: 'format',
				displayName: 'Format',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'markdown',
						options: [
							{ name: 'Branding', value: 'branding' },
							{ name: 'HTML', value: 'html' },
							{ name: 'Images', value: 'images' },
							{ name: 'JSON', value: 'json' },
							{ name: 'Links', value: 'links' },
							{ name: 'Markdown', value: 'markdown' },
							{ name: 'Screenshot', value: 'screenshot' },
							{ name: 'Summary', value: 'summary' },
						],
					},
					{
						displayName: 'Mode',
						name: 'mode',
						type: 'options',
						default: 'normal',
						description: 'Pre-processing mode applied to the source HTML',
						displayOptions: { show: { type: ['markdown', 'html'] } },
						options: [
							{ name: 'Normal', value: 'normal' },
							{ name: 'Reader', value: 'reader' },
							{ name: 'Prune', value: 'prune' },
						],
					},
					{
						displayName: 'Prompt',
						name: 'prompt',
						type: 'string',
						default: '',
						placeholder: 'e.g. extract product name and price',
						description: 'Natural-language description of what to extract',
						displayOptions: { show: { type: ['json'] } },
					},
					{
						displayName: 'Schema (JSON)',
						name: 'schema',
						type: 'json',
						default: '',
						description: 'Optional JSON schema describing the desired output shape',
						displayOptions: { show: { type: ['json'] } },
					},
					{
						displayName: 'Full Page',
						name: 'fullPage',
						type: 'boolean',
						default: false,
						description: 'Whether to capture the entire scrollable page',
						displayOptions: { show: { type: ['screenshot'] } },
					},
					{
						displayName: 'Width',
						name: 'width',
						type: 'number',
						default: 1280,
						description: 'Viewport width in pixels',
						displayOptions: { show: { type: ['screenshot'] } },
					},
					{
						displayName: 'Height',
						name: 'height',
						type: 'number',
						default: 720,
						description: 'Viewport height in pixels',
						displayOptions: { show: { type: ['screenshot'] } },
					},
					{
						displayName: 'Quality',
						name: 'quality',
						type: 'number',
						default: 80,
						typeOptions: { minValue: 1, maxValue: 100 },
						description: 'Image quality from 1 to 100',
						displayOptions: { show: { type: ['screenshot'] } },
					},
				],
			},
		],
	};
}

interface FormatEntry extends IDataObject {
	type: string;
	mode?: string;
	prompt?: string;
	schema?: string;
	fullPage?: boolean;
	width?: number;
	height?: number;
	quality?: number;
}

export function buildFormats(this: IExecuteFunctions, itemIndex: number): IDataObject[] {
	const collection = this.getNodeParameter('formats', itemIndex, {}) as { format?: FormatEntry[] };
	const entries = collection.format ?? [];
	if (entries.length === 0) return [{ type: 'markdown' }];

	return entries.map((entry) => {
		const out: IDataObject = { type: entry.type };

		if (entry.type === 'markdown' || entry.type === 'html') {
			if (entry.mode && entry.mode !== 'normal') out.mode = entry.mode;
		}
		if (entry.type === 'json') {
			if (entry.prompt) out.prompt = entry.prompt;
			if (entry.schema) {
				const schema = parseJsonObject.call(this, entry.schema, 'Schema', itemIndex);
				if (Object.keys(schema).length > 0) out.schema = schema;
			}
		}
		if (entry.type === 'screenshot') {
			if (entry.fullPage) out.fullPage = true;
			if (typeof entry.width === 'number' && entry.width !== 1280) out.width = entry.width;
			if (typeof entry.height === 'number' && entry.height !== 720) out.height = entry.height;
			if (typeof entry.quality === 'number' && entry.quality !== 80) out.quality = entry.quality;
		}

		return out;
	});
}
