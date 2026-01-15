export enum RoleType {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export const DEFAULT_ROLES = {
  [RoleType.ADMIN]: {
    id: 'admin-uuid',
    name: RoleType.ADMIN,
    description: 'Organization Administrator',
  },
  [RoleType.MEMBER]: {
    id: 'member-uuid',
    name: RoleType.MEMBER,
    description: 'Organization Member',
  },
};
