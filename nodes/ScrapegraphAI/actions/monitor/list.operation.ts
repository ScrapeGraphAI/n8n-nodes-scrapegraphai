import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { MONITOR_RESOURCE } from './monitor.resource';

export const listFields: INodeProperties[] = [
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: ['list'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const simplify = this.getNodeParameter('simplify', itemIndex) as boolean;

	const response = await safeRequest.call(this, itemIndex, 'GET', '/monitor');

	const monitors = Array.isArray(response) ? response : ((response as IDataObject).monitors as IDataObject[]) ?? [];

	return monitors.map((m) => {
		const cfg = (m.config as IDataObject | undefined) ?? {};
		return {
			json: simplify
				? {
						cronId: m.cronId,
						status: m.status,
						interval: m.interval,
						name: cfg.name,
						url: cfg.url,
						formats: cfg.formats,
						webhookUrl: cfg.webhookUrl,
						fetchConfig: cfg.fetchConfig,
						createdAt: m.createdAt,
						updatedAt: m.updatedAt,
				  }
				: m,
			pairedItem: { item: itemIndex },
		};
	});
}
