import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { fetchConfigField, buildFetchConfig } from '../../transport/fetchConfig';
import { makeFormatsField, buildFormats } from '../../transport/formats';
import { MONITOR_RESOURCE } from './monitor.resource';

const OPS = ['create'];

export const createFields: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://example.com',
		description: 'Public URL to monitor',
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. homepageWatch',
		description: 'Human-readable monitor name',
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Interval (Cron)',
		name: 'interval',
		type: 'string',
		required: true,
		default: '*/30 * * * *',
		placeholder: 'e.g. */30 * * * *',
		description: '5-field cron expression controlling when the monitor fires',
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: OPS } },
	},
	makeFormatsField(MONITOR_RESOURCE, OPS),
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		placeholder: 'e.g. https://your-server.com/sgai-webhook',
		description: 'Optional URL that receives a POST on every tick',
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: OPS } },
	},
	{
		...fetchConfigField,
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: OPS } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const url = this.getNodeParameter('url', itemIndex) as string;
	const name = this.getNodeParameter('name', itemIndex) as string;
	const interval = this.getNodeParameter('interval', itemIndex) as string;
	const webhookUrl = this.getNodeParameter('webhookUrl', itemIndex, '') as string;

	const body: IDataObject = {
		url,
		name,
		interval,
		formats: buildFormats.call(this, itemIndex),
	};
	if (webhookUrl) body.webhookUrl = webhookUrl;

	const fetchConfig = buildFetchConfig.call(this, itemIndex);
	if (Object.keys(fetchConfig).length > 0) body.fetchConfig = fetchConfig;

	const response = await safeRequest.call(this, itemIndex, 'POST', '/monitor', body);

	return { json: response as IDataObject, pairedItem: { item: itemIndex } };
}
