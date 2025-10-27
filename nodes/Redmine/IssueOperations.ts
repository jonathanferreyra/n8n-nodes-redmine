import { INodeProperties } from 'n8n-workflow';
import { issueOperations } from './issue/operations';
import { commonFields, createFields, updateFields } from './issue/fields';
import { additionalFields } from './issue/additionalFields';
import { issueGetAllOperations } from './Issue.getAll.Operations';

export { issueOperations };

export const issueFields: INodeProperties[] = [
  ...commonFields,
  ...issueGetAllOperations,
  ...createFields,
  ...updateFields,
  additionalFields,
];
