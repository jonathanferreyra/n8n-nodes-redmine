import { INodeProperties } from 'n8n-workflow';

export const additionalFields: INodeProperties = {
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: {
      resource: ['issue'],
      operation: ['create', 'update'],
    },
  },
  options: [
    {
      displayName: 'Assigned To ID',
      name: 'assigned_to_id',
      type: 'string',
      default: '',
      description: 'The ID of the user to assign the issue to',
    },
    {
      displayName: 'Category ID',
      name: 'category_id',
      type: 'string',
      default: '',
      description: 'The category ID of the issue',
    },
    {
      displayName: 'Custom Fields',
      name: 'customFields',
      placeholder: 'Add Custom Field',
      type: 'fixedCollection',
      typeOptions: {
        multipleValues: true,
      },
      default: {},
      options: [
        {
          name: 'field',
          displayName: 'Field',
          values: [
            {
              displayName: 'Field ID',
              name: 'id',
              type: 'string',
              default: '',
              description: 'ID of the custom field',
            },
            {
              displayName: 'Field Value',
              name: 'value',
              type: 'string',
              default: '',
              description: 'Value of the custom field',
            },
          ],
        },
      ],
    },
    {
      displayName: 'Description',
      name: 'description',
      type: 'string',
      default: '',
      description: 'The description of the issue',
      typeOptions: {
        rows: 4,
      },
    },
    {
      displayName: 'Due Date',
      name: 'due_date',
      type: 'dateTime',
      default: '',
      description: 'The due date of the issue',
    },
    {
      displayName: 'Estimated Hours',
      name: 'estimated_hours',
      type: 'number',
      default: 0,
      description: 'The estimated hours for the issue',
    },
    {
      displayName: 'Is Private',
      name: 'is_private',
      type: 'boolean',
      default: false,
      description: 'Whether the issue is private or not',
    },
    {
      displayName: 'Fixed Version ID',
      name: 'fixed_version_id',
      type: 'string',
      default: '',
      description: 'The fixed version ID of the issue. Also known as Target Version ID.',
    },
    {
      displayName: 'Parent Issue ID',
      name: 'parent_issue_id',
      type: 'string',
      default: '',
      description: 'The ID of the parent issue',
    },
    {
      displayName: 'Priority ID',
      name: 'priority_id',
      type: 'string',
      default: '',
      description: 'The priority ID of the issue',
    },
    {
      displayName: 'Start Date',
      name: 'start_date',
      type: 'dateTime',
      default: '',
      description: 'The start date of the issue',
    },
    {
      displayName: 'Status ID',
      name: 'status_id',
      type: 'string',
      default: '',
      description: 'The status ID of the issue',
    },
    {
      displayName: 'Tracker ID',
      name: 'tracker_id',
      type: 'string',
      default: '',
      description: 'The tracker ID of the issue',
    },
  ],
}; 