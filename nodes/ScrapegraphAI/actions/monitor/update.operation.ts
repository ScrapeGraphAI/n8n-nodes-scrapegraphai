import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { safeRequest, parseJsonParam, parseJsonObject } from '../../transport/request';
import { MONITOR_RESOURCE, monitorIdLocator } from './monitor.resource';

const OPS = ['update'];

export const updateFields: INodeProperties[] = [
	{
		...monitorIdLocator,
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Fields to send in the update — only fields added here will be modified',
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: OPS } },
		options: [
			{
				displayName: 'Interval (Cron)',
				name: 'interval',
				type: 'string',
				default: '0 */6 * * *',
				placeholder: 'e.g. 0 */6 * * *',
				description: '5-field cron expression',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				placeholder: 'e.g. https://your-server.com/sgai-webhook',
				description: 'URL to receive the payload on every tick (send empty string to clear)',
			},
			{
				displayName: 'Formats (JSON)',
				name: 'formats',
				type: 'json',
				default: '[\n  { "type": "markdown" }\n]',
				description: 'New formats array — same shape as the Scrape resource',
			},
			{
				displayName: 'Fetch Config (JSON)',
				name: 'fetchConfig',
				type: 'json',
				default: '{}',
				description: 'New fetch options — see Fetch Config on the Scrape resource',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('cronId', itemIndex, '', { extractValue: true }) as string;
	const updates = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	const body: IDataObject = {};

	if (updates.interval) body.interval = updates.interval;
	if (updates.webhookUrl !== undefined) body.webhookUrl = updates.webhookUrl;
	if (updates.formats) {
		const formats = parseJsonParam.call(this, updates.formats as string, 'Formats', itemIndex);
		if (!Array.isArray(formats)) {
			throw new NodeOperationError(
				this.getNode(),
				`The 'Formats' parameter must be a JSON array [item ${itemIndex}]`,
				{
					description: `Wrap format entries in square brackets, e.g. [{ "type": "markdown" }].`,
					itemIndex,
				},
			);
		}
		if (formats.length > 0) body.formats = formats;
	}
	if (updates.fetchConfig) {
		const fc = parseJsonObject.call(this, updates.fetchConfig as string, 'Fetch Config', itemIndex);
		if (Object.keys(fc).length > 0) body.fetchConfig = fc;
	}

	if (Object.keys(body).length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			`Add at least one field to 'Update Fields' before running this operation [item ${itemIndex}]`,
			{
				description: `Open the 'Update Fields' collection and click 'Add Field' to choose what to change on the monitor.`,
				itemIndex,
			},
		);
	}

	const response = await safeRequest.call(this, itemIndex, 'PATCH', `/monitor/${id}`, body);
	return { json: response as IDataObject, pairedItem: { item: itemIndex } };
}
