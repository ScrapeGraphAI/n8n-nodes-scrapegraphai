import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodeListSearchItems,
	IDataObject,
} from 'n8n-workflow';
import { API_BASE_URL } from '../transport/request';

async function fetchList(this: ILoadOptionsFunctions, path: string): Promise<unknown> {
	return this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
		method: 'GET',
		url: `${API_BASE_URL}${path}`,
		headers: { Accept: 'application/json' },
		json: true,
	});
}

export async function listMonitors(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	let response: unknown;
	try {
		response = await fetchList.call(this, '/monitor');
	} catch {
		return { results: [] };
	}

	const monitors = Array.isArray(response)
		? (response as IDataObject[])
		: ((response as IDataObject).monitors as IDataObject[]) ?? [];

	const results: INodeListSearchItems[] = monitors
		.map((m) => {
			const name = (m.config as IDataObject | undefined)?.name as string | undefined;
			const url = (m.config as IDataObject | undefined)?.url as string | undefined;
			const cronId = m.cronId as string;
			return {
				name: name ? `${name} (${url ?? cronId})` : cronId,
				value: cronId,
			};
		})
		.filter((r) => !filter || r.name.toLowerCase().includes(filter.toLowerCase()));

	return { results };
}

export async function listHistory(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	let response: unknown;
	try {
		response = await fetchList.call(this, '/history?limit=50');
	} catch {
		return { results: [] };
	}

	const entries =
		((response as IDataObject).data as IDataObject[]) ??
		(Array.isArray(response) ? (response as IDataObject[]) : []);

	const results: INodeListSearchItems[] = entries
		.map((e) => {
			const id = e.id as string;
			const service = (e.service as string | undefined) ?? '';
			const url = (e.params as IDataObject | undefined)?.url as string | undefined;
			const label = url ? `${service}: ${url} (${id.slice(0, 8)})` : `${service}: ${id}`;
			return { name: label, value: id };
		})
		.filter((r) => !filter || r.name.toLowerCase().includes(filter.toLowerCase()));

	return { results };
}

export async function listCrawls(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	let response: unknown;
	try {
		response = await fetchList.call(this, '/crawl');
	} catch {
		return { results: [] };
	}

	const crawls = Array.isArray(response)
		? (response as IDataObject[])
		: ((response as IDataObject).crawls as IDataObject[]) ?? [];

	const results: INodeListSearchItems[] = crawls
		.map((c) => {
			const id = c.id as string;
			const url = c.url as string | undefined;
			const status = c.status as string | undefined;
			const label = url ? `${url} — ${status ?? ''} (${id.slice(0, 8)})` : id;
			return { name: label, value: id };
		})
		.filter((r) => !filter || r.name.toLowerCase().includes(filter.toLowerCase()));

	return { results };
}
