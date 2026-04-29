import type { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface V2ValidationDetail {
	code?: string;
	format?: string;
	path?: Array<string | number>;
	message?: string;
}

interface V2ErrorBody {
	error?: {
		type?: string;
		message?: string;
		details?: V2ValidationDetail[];
	};
}

export function buildV2Error(
	this: IExecuteFunctions,
	err: unknown,
	itemIndex: number,
): NodeApiError {
	const wrapped = err as { response?: { body?: V2ErrorBody; statusCode?: number }; message?: string };
	const body = wrapped?.response?.body ?? {};
	const status = wrapped?.response?.statusCode;
	const errPayload = body?.error;

	const type = errPayload?.type ?? 'unknown';
	const baseMessage = errPayload?.message ?? wrapped?.message ?? 'The request did not complete';

	let message = baseMessage;
	let description = '';

	if (type === 'validation' && errPayload?.details?.length) {
		const fields = errPayload.details
			.map((d) => `'${(d.path ?? []).join('.') || 'request body'}'`)
			.filter((v, i, a) => a.indexOf(v) === i)
			.join(', ');
		message = `${baseMessage} for ${fields} [item ${itemIndex}]`;
		description = errPayload.details
			.map((d) => `${(d.path ?? []).join('.')}: ${d.message ?? d.code ?? 'invalid'}`)
			.join('\n');
		description += '\n\nFix the listed fields and retry.';
	} else if (type === 'auth_missing_key') {
		description =
			'Open the credentials editor and paste a valid ScrapeGraphAI API key. Keys are issued from https://scrapegraphai.com/dashboard.';
	} else if (type === 'auth_invalid_key') {
		description =
			'The key is malformed, revoked, or only valid for the legacy v1 surface. Generate a new v2 key from https://scrapegraphai.com/dashboard.';
	} else if (type === 'insufficient_credits') {
		description = 'Top up credits or upgrade the plan, then retry. Use the Credits resource to check the current balance.';
	} else if (type === 'not_found') {
		description =
			'The ID does not exist for this account. Verify the UUID is correct and that it was issued by this API key.';
	} else if (type === 'rate_limited') {
		description = 'Reduce the request frequency or add a Wait node between calls. Per-minute limits depend on the active plan.';
	} else if (type === 'internal_error') {
		description = 'Transient server-side condition. Retry with exponential backoff (3–5 attempts).';
	} else {
		description = wrapped?.message ?? '';
	}

	return new NodeApiError(this.getNode(), (errPayload ?? wrapped) as unknown as JsonObject, {
		message,
		description,
		httpCode: status?.toString(),
		itemIndex,
	});
}
