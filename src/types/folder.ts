// Folder domain type

export type VisibilityType = 'all_space_members' | 'team_restricted';

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  children?: Folder[];
  articleCount?: number;
  visibilityType?: VisibilityType; // defaults to 'all_space_members'
  allowedTeams?: string[]; // list of teamIds
}
