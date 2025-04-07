export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'blocked' | 'pending';
    dateJoined: string;
  }
  
  export interface ICustomer {
    _id: string;
    clientId: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    joinedDate?: string;
  }
  