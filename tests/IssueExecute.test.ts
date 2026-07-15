import { describe, expect, it } from 'vitest';
import { NodeOperationError } from 'n8n-workflow';

import { executeIssueOperation } from '../nodes/Redmine/IssueExecute';
import { issueGetAllOperations } from '../nodes/Redmine/Issue.getAll.Operations';
import { createExecuteContext, getLastRequest } from './helpers';

const baseParams = {
	baseUrl: 'https://redmine.example.com',
	apiKey: 'secret-key',
	i: 0,
};

describe('executeIssueOperation', () => {
	it('shows Max Items only for issue getAll returnAll mode', () => {
		const maxItemsProperty = issueGetAllOperations.find((property) => property.name === 'maxItems');

		expect(maxItemsProperty).toMatchObject({
			displayName: 'Max Items',
			name: 'maxItems',
			type: 'number',
			displayOptions: {
				show: {
					resource: ['issue'],
					operation: ['getAll'],
					returnAll: [true],
				},
			},
			typeOptions: {
				minValue: 1,
			},
			default: 1000,
		});
	});

	it('gets an issue with includes, headers, impersonation, json, and paired item', async () => {
		const responseData = { issue: { id: 123 } };
		const { context, requestMock } = createExecuteContext(
			{
				issueId: '123',
				include: ['attachments', 'journals'],
				options: { impersonateUser: 'alice' },
			},
			responseData,
		);

		const result = await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'get',
		});
		const request = getLastRequest(requestMock);

		expect(request).toMatchObject({
			method: 'GET',
			uri: 'https://redmine.example.com/issues/123.json',
			qs: { include: 'attachments,journals' },
			headers: {
				'X-Redmine-API-Key': 'secret-key',
				'X-Redmine-Switch-User': 'alice',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(request).not.toHaveProperty('body');
		expect(result).toEqual({ json: responseData, pairedItem: { item: 0 } });
	});

	it('builds getAll query params for filters, dates, custom status, and pagination', async () => {
		const { context, requestMock } = createExecuteContext({
			returnAll: false,
			limit: 25,
			offset: 50,
			sort: 'created_on:desc',
			include: ['watchers', 'relations'],
			filters: {
				issue_id: '10',
				project_id: 'project-a',
				subproject_id: '!*',
				tracker_id: '1',
				status_id: 'custom',
				custom_status_id: '7',
				assigned_to_id: 'me',
				parent_id: '20',
				author_id: '5',
				priority_id: '3',
				category_id: '4',
				fixed_version_id: '6',
				target_version_id: '8',
				subject: 'bug',
				filterByCreationDate: true,
				creationDateFilterType: 'range',
				creationDateStart: '2026-01-01',
				creationDateEnd: '2026-01-31',
				filterByUpdatedDate: true,
				updatedDateFilterType: 'after',
				updatedDate: '2026-02-01',
				customFields: {
					field: [
						{ id: '12', value: 'frontend' },
						{ id: '13', value: 'high' },
					],
				},
			},
			options: {},
		});

		await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'getAll',
		});
		const request = getLastRequest(requestMock);

		expect(request).toMatchObject({
			method: 'GET',
			uri: 'https://redmine.example.com/issues.json',
			qs: {
				limit: 25,
				offset: 50,
				sort: 'created_on:desc',
				include: 'watchers,relations',
				issue_id: '10',
				project_id: 'project-a',
				subproject_id: '!*',
				tracker_id: '1',
				status_id: '7',
				assigned_to_id: 'me',
				parent_id: '20',
				author_id: '5',
				priority_id: '3',
				category_id: '4',
				fixed_version_id: '6',
				target_version_id: '8',
				subject: 'bug',
				created_on: '><2026-01-01|2026-01-31',
				updated_on: '>=2026-02-01',
				cf_12: 'frontend',
				cf_13: 'high',
			},
			json: true,
		});
		expect(request.headers).not.toHaveProperty('X-Redmine-Switch-User');
		expect(request).not.toHaveProperty('body');
	});

	it('creates an issue with additional fields, booleans, and custom fields', async () => {
		const { context, requestMock } = createExecuteContext({
			projectId: 'project-a',
			subject: 'New issue',
			additionalFields: {
				description: 'Details',
				category_id: '4',
				status_id: '1',
				tracker_id: '2',
				priority_id: '3',
				assigned_to_id: '5',
				fixed_version_id: '6',
				parent_issue_id: '7',
				start_date: '2026-01-01',
				due_date: '2026-01-15',
				estimated_hours: 4,
				is_private: false,
				customFields: {
					field: [{ id: '12', value: 'frontend' }],
				},
			},
			options: {},
		});

		await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'create',
		});
		const request = getLastRequest(requestMock);

		expect(request).toMatchObject({
			method: 'POST',
			uri: 'https://redmine.example.com/issues.json',
			body: {
				issue: {
					project_id: 'project-a',
					subject: 'New issue',
					description: 'Details',
					category_id: '4',
					status_id: '1',
					tracker_id: '2',
					priority_id: '3',
					assigned_to_id: '5',
					fixed_version_id: '6',
					parent_issue_id: '7',
					start_date: '2026-01-01',
					due_date: '2026-01-15',
					estimated_hours: 4,
					is_private: false,
					custom_fields: [{ id: '12', value: 'frontend' }],
				},
			},
		});
	});

	it('updates an issue with partial fields, notes, private notes, and custom fields', async () => {
		const { context, requestMock } = createExecuteContext({
			issueId: '123',
			subject: 'Updated issue',
			notes: 'Progress note',
			private_notes: 'true',
			additionalFields: {
				description: 'Updated details',
				is_private: true,
				customFields: {
					field: [{ id: '12', value: 'backend' }],
				},
			},
			options: {},
		});

		await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'update',
		});
		const request = getLastRequest(requestMock);

		expect(request).toMatchObject({
			method: 'PUT',
			uri: 'https://redmine.example.com/issues/123.json',
			body: {
				issue: {
					subject: 'Updated issue',
					notes: 'Progress note',
					private_notes: true,
					description: 'Updated details',
					is_private: true,
					custom_fields: [{ id: '12', value: 'backend' }],
				},
			},
		});
	});

	it('deletes an issue without sending a body', async () => {
		const { context, requestMock } = createExecuteContext({
			issueId: '123',
			options: {},
		});

		await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'delete',
		});
		const request = getLastRequest(requestMock);

		expect(request).toMatchObject({
			method: 'DELETE',
			uri: 'https://redmine.example.com/issues/123.json',
			json: true,
		});
		expect(request).not.toHaveProperty('body');
	});

	it('adds a watcher to an issue', async () => {
		const { context, requestMock } = createExecuteContext({
			issueId: '123',
			userId: '456',
			options: {},
		});

		await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'addWatcher',
		});
		const request = getLastRequest(requestMock);

		expect(request).toMatchObject({
			method: 'POST',
			uri: 'https://redmine.example.com/issues/123/watchers.json',
			body: { user_id: '456' },
		});
	});

	it('wraps Redmine request errors in NodeOperationError', async () => {
		const { context } = createExecuteContext({
			issueId: '123',
			include: [],
			options: {},
		});

		context.helpers.request = async () => {
			throw new Error('Unauthorized');
		};

		await expect(
			executeIssueOperation.call(context, {
				...baseParams,
				operation: 'get',
			}),
		).rejects.toBeInstanceOf(NodeOperationError);
	});

	it('paginates all matching issue results when returnAll is true using the default maxItems cap', async () => {
		const pageIssues = Array.from({ length: 100 }, (_, index) => ({ id: index + 1 }));
		const { context, requestMock } = createExecuteContext({
			returnAll: true,
			sort: '',
			include: [],
			filters: {},
			options: {},
		});

		for (let page = 0; page < 10; page++) {
			requestMock.mockResolvedValueOnce({
				issues: pageIssues.map((issue) => ({ id: issue.id + page * 100 })),
				total_count: 1100,
				offset: page * 100,
				limit: 100,
			});
		}

		const result = await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'getAll',
		});

		expect(requestMock).toHaveBeenCalledTimes(10);
		expect(requestMock.mock.calls[9][0]).toMatchObject({
			qs: {
				limit: 100,
				offset: 900,
			},
		});
		expect(result.json).toMatchObject({
			total_count: 1100,
			offset: 0,
			limit: 1000,
		});
		expect((result.json as { issues: unknown[] }).issues).toHaveLength(1000);
	});

	it('paginates all matching issue results when returnAll is true without exceeding configurable maxItems', async () => {
		const { context, requestMock } = createExecuteContext({
			returnAll: true,
			maxItems: 125,
			sort: 'created_on:desc',
			include: ['watchers'],
			filters: {
				project_id: 'project-a',
				status_id: 'open',
				customFields: {
					field: [{ id: '12', value: 'frontend' }],
				},
			},
			options: {},
		});

		requestMock
			.mockResolvedValueOnce({
				issues: Array.from({ length: 100 }, (_, index) => ({ id: index + 1 })),
				total_count: 300,
				offset: 0,
				limit: 100,
			})
			.mockResolvedValueOnce({
				issues: Array.from({ length: 25 }, (_, index) => ({ id: index + 101 })),
				total_count: 300,
				offset: 100,
				limit: 25,
			});

		const result = await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'getAll',
		});

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(requestMock.mock.calls[0][0]).toMatchObject({
			method: 'GET',
			uri: 'https://redmine.example.com/issues.json',
			qs: {
				limit: 100,
				offset: 0,
				sort: 'created_on:desc',
				include: 'watchers',
				project_id: 'project-a',
				status_id: 'open',
				cf_12: 'frontend',
			},
		});
		expect(requestMock.mock.calls[1][0]).toMatchObject({
			qs: {
				limit: 25,
				offset: 100,
				sort: 'created_on:desc',
				include: 'watchers',
				project_id: 'project-a',
				status_id: 'open',
				cf_12: 'frontend',
			},
		});
		expect(result.json).toMatchObject({
			total_count: 300,
			offset: 0,
			limit: 125,
		});
		expect((result.json as { issues: unknown[] }).issues).toHaveLength(125);
		expect(result.pairedItem).toEqual({ item: 0 });
	});

	it('reports aggregated limit as maxItems for returnAll when internal requests use a final remainder', async () => {
		const { context, requestMock } = createExecuteContext({
			returnAll: true,
			maxItems: 130,
			sort: '',
			include: [],
			filters: {},
			options: {},
		});

		requestMock
			.mockResolvedValueOnce({
				issues: Array.from({ length: 100 }, (_, index) => ({ id: index + 1 })),
				total_count: 7624,
				offset: 0,
				limit: 100,
			})
			.mockResolvedValueOnce({
				issues: Array.from({ length: 30 }, (_, index) => ({ id: index + 101 })),
				total_count: 7624,
				offset: 100,
				limit: 30,
			});

		const result = await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'getAll',
		});

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(requestMock.mock.calls[0][0]).toMatchObject({
			qs: {
				limit: 100,
				offset: 0,
			},
		});
		expect(requestMock.mock.calls[1][0]).toMatchObject({
			qs: {
				limit: 30,
				offset: 100,
			},
		});
		expect(result.json).toMatchObject({
			total_count: 7624,
			offset: 0,
			limit: 130,
		});
		expect((result.json as { issues: unknown[] }).issues).toHaveLength(130);
	});

	it('stops paginating issue results when Redmine returns an empty page', async () => {
		const firstPageIssues = Array.from({ length: 100 }, (_, index) => ({ id: index + 1 }));
		const { context, requestMock } = createExecuteContext({
			returnAll: true,
			maxItems: 1000,
			sort: '',
			include: [],
			filters: {},
			options: {},
		});

		requestMock
			.mockResolvedValueOnce({
				issues: firstPageIssues,
				offset: 0,
				limit: 100,
			})
			.mockResolvedValueOnce({
				issues: [],
				offset: 1,
				limit: 100,
			});

		const result = await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'getAll',
		});

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(requestMock.mock.calls[1][0]).toMatchObject({
			qs: {
				limit: 100,
				offset: 100,
			},
		});
		expect(result).toEqual({
			json: {
				issues: firstPageIssues,
				total_count: 100,
				offset: 0,
				limit: 100,
			},
			pairedItem: { item: 0 },
		});
	});
});
