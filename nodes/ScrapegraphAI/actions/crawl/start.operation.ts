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
		default: 50,
		typeOptions: { minValue: 1, maxValue: 1000 },
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
		default: 10,
		typeOptions: { minValue: 1 },
		description: 'Cap on links expanded per page',
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Allow External Links',
		name: 'allowExternal',
		type: 'boolean',
		default: false,
		description: 'Whether to follow links to other domains. Off by default — same-origin only.',
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
		displayName: 'Content Types',
		name: 'contentTypes',
		type: 'multiOptions',
		default: [],
		description: 'Optional. Limit crawled pages to these MIME types. Leave empty for all.',
		options: [
			{ name: 'CSV', value: 'text/csv' },
			{ name: 'Excel (.xlsx)', value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
			{ name: 'HTML', value: 'text/html' },
			{ name: 'JPEG', value: 'image/jpeg' },
			{ name: 'PDF', value: 'application/pdf' },
			{ name: 'Plain Text', value: 'text/plain' },
			{ name: 'PNG', value: 'image/png' },
			{ name: 'PowerPoint (.pptx)', value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
			{ name: 'WebP', value: 'image/webp' },
			{ name: 'Word (.docx)', value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
		],
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
	const allowExternal = this.getNodeParameter('allowExternal', itemIndex, false) as boolean;
	const includePatterns = this.getNodeParameter('includePatterns', itemIndex, []) as string[];
	const excludePatterns = this.getNodeParameter('excludePatterns', itemIndex, []) as string[];
	const contentTypes = this.getNodeParameter('contentTypes', itemIndex, []) as string[];

	const body: IDataObject = {
		url,
		formats: buildFormats.call(this, itemIndex),
		maxPages,
		maxDepth,
		maxLinksPerPage,
	};
	if (allowExternal) body.allowExternal = true;
	if (includePatterns.length > 0) body.includePatterns = includePatterns;
	if (excludePatterns.length > 0) body.excludePatterns = excludePatterns;
	if (contentTypes.length > 0) body.contentTypes = contentTypes;

	const fetchConfig = buildFetchConfig.call(this, itemIndex);
	if (Object.keys(fetchConfig).length > 0) body.fetchConfig = fetchConfig;

	const response = await safeRequest.call(this, itemIndex, 'POST', '/crawl', body);

	return { json: response as IDataObject, pairedItem: { item: itemIndex } };
}
