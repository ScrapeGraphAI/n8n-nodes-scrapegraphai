import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { fetchConfigField, buildFetchConfig } from '../../transport/fetchConfig';
import { makeFormatsField, buildFormats } from '../../transport/formats';
import { CRAWL_RESOURCE } from './crawl.resource';

const OPS = ['start'];

export const startFields: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://example.com',
		description: 'Starting URL to crawl',
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: OPS } },
	},
	makeFormatsField(CRAWL_RESOURCE, OPS),
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		default: 5,
		typeOptions: { minValue: 1 },
		description: 'Maximum number of pages to crawl',
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Max Depth',
		name: 'maxDepth',
		type: 'number',
		default: 2,
		typeOptions: { minValue: 0 },
		description: 'How many levels of links to follow from the starting URL',
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Max Links per Page',
		name: 'maxLinksPerPage',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Cap on links expanded per page (0 = unlimited)',
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Include Patterns',
		name: 'includePatterns',
		type: 'string',
		typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Pattern' },
		default: [],
		placeholder: 'e.g. /blog/*',
		description: 'Glob-style URL patterns to include',
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Exclude Patterns',
		name: 'excludePatterns',
		type: 'string',
		typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Pattern' },
		default: [],
		placeholder: 'e.g. /admin/*',
		description: 'Glob-style URL patterns to exclude',
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: OPS } },
	},
	{
		...fetchConfigField,
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: OPS } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const url = this.getNodeParameter('url', itemIndex) as string;
	const maxPages = this.getNodeParameter('maxPages', itemIndex) as number;
	const maxDepth = this.getNodeParameter('maxDepth', itemIndex) as number;
	const maxLinksPerPage = this.getNodeParameter('maxLinksPerPage', itemIndex) as number;
	const includePatterns = this.getNodeParameter('includePatterns', itemIndex, []) as string[];
	const excludePatterns = this.getNodeParameter('excludePatterns', itemIndex, []) as string[];

	const body: IDataObject = {
		url,
		formats: buildFormats.call(this, itemIndex),
		maxPages,
		maxDepth,
	};
	if (maxLinksPerPage > 0) body.maxLinksPerPage = maxLinksPerPage;
	if (includePatterns.length > 0) body.includePatterns = includePatterns;
	if (excludePatterns.length > 0) body.excludePatterns = excludePatterns;

	const fetchConfig = buildFetchConfig.call(this, itemIndex);
	if (Object.keys(fetchConfig).length > 0) body.fetchConfig = fetchConfig;

	const response = await safeRequest.call(this, itemIndex, 'POST', '/crawl', body);

	return { json: response as IDataObject, pairedItem: { item: itemIndex } };
}
