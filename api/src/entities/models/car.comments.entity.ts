export interface ICarCommentsEntity {
  id?: string;
  carId: string;
  user: {
      id: string;
      name: string;
      profileImage: string;
  };
  content: string;
  parentId?: string | null;
  likes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}