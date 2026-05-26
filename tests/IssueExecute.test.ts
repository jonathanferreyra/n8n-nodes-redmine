import { describe, expect, it, vi } from 'vitest';
import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { executeIssueOperation } from '../nodes/Redmine/IssueExecute';
import { Redmine } from '../nodes/Redmine/Redmine.node';
import { createExecuteContext, getLastRequest } from './helpers';

const baseParams = {
	baseUrl: 'https://redmine.example.com',
	apiKey: 'secret-key',
	i: 0,
};

describe('executeIssueOperation', () => {
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

	it('uses the selected status list value as the status filter', async () => {
		const { context, requestMock } = createExecuteContext({
			returnAll: false,
			limit: 25,
			offset: 0,
			include: [],
			status_list: '7',
			filters: {},
			options: {},
		});

		await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'getAll',
		});
		const request = getLastRequest(requestMock);

		expect(request.qs).toMatchObject({
			status_id: '7',
		});
	});

	it('prioritizes status list over the static status filter', async () => {
		const { context, requestMock } = createExecuteContext({
			returnAll: false,
			limit: 25,
			offset: 0,
			include: [],
			status_list: '7',
			filters: {
				status_id: 'open',
			},
			options: {},
		});

		await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'getAll',
		});
		const request = getLastRequest(requestMock);

		expect(request.qs).toMatchObject({
			status_id: '7',
		});
	});

	it('prioritizes status list over custom status ID', async () => {
		const { context, requestMock } = createExecuteContext({
			returnAll: false,
			limit: 25,
			offset: 0,
			include: [],
			status_list: '7',
			filters: {
				status_id: 'custom',
				custom_status_id: '9',
			},
			options: {},
		});

		await executeIssueOperation.call(context, {
			...baseParams,
			operation: 'getAll',
		});
		const request = getLastRequest(requestMock);

		expect(request.qs).toMatchObject({
			status_id: '7',
		});
	});

	it('creates an issue with additional fields, booleans, and custom fields', async () => {
		const { context, requestMock } = createExecuteContext({
			projectId: 'project-a',
			subject: 'New issue',
			status_list: '9',
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
					status_id: '9',
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
			status_list: '5',
			additionalFields: {
				description: 'Updated details',
				status_id: '1',
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
					status_id: '5',
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

	it.todo('paginates all matching issue results when returnAll is true');
});

describe('Redmine load options', () => {
	it('loads issue statuses from Redmine', async () => {
		const requestMock = vi.fn().mockResolvedValue({
			issue_statuses: [
				{ id: 1, name: 'New', is_closed: false },
				{ id: 5, name: 'Resolved', is_closed: false },
			],
		});
		const context = {
			getCredentials: vi.fn().mockResolvedValue({
				url: 'https://redmine.example.com',
				apiKey: 'secret-key',
			}),
			helpers: {
				request: requestMock,
			},
			getNode: vi.fn(() => ({
				id: 'redmine-node',
				name: 'Redmine',
				type: 'n8n-nodes-redmine.redmine',
				typeVersion: 1,
				position: [0, 0],
				parameters: {},
			})),
		} as unknown as ILoadOptionsFunctions;

		const options = await new Redmine().methods.loadOptions.getIssueStatuses.call(context);

		expect(requestMock).toHaveBeenCalledWith({
			method: 'GET',
			uri: 'https://redmine.example.com/issue_statuses.json',
			headers: {
				'X-Redmine-API-Key': 'secret-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(options).toEqual([
			{ name: 'New', value: '1' },
			{ name: 'Resolved', value: '5' },
		]);
	});
});
