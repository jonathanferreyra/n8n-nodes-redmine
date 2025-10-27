import { INodeProperties } from 'n8n-workflow';
import { ISSUE_INCLUDE_OPTIONS } from './constants';

export const commonFields: INodeProperties[] = [
  {
    displayName: 'Issue ID',
    name: 'issueId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['get', 'delete', 'update'],
      },
    },
    default: '',
    description: 'The ID of the issue to get',
  },
  {
    displayName: 'Include',
    name: 'include',
    type: 'multiOptions',
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['get'],
      },
    },
    options: ISSUE_INCLUDE_OPTIONS,
    default: [],
    description: 'Associated data to include in the response',
  },
];

export const createFields: INodeProperties[] = [
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The ID of the project the issue belongs to',
  },
  {
    displayName: 'Subject',
    name: 'subject',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'The subject of the issue',
  },
];

export const updateFields: INodeProperties[] = [
  {
    displayName: 'Subject',
    name: 'subject',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The new subject of the issue. If blank, the subject will not be changed.',
  },
  {
    displayName: 'Notes',
    name: 'notes',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'Comments about the update',
  },
  {
    displayName: 'Private Notes',
    name: 'private_notes',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['issue'],
        operation: ['update'],
      },
    },
    default: false,
    description: 'Whether to create private notes',
  },
]; 