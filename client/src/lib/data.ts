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
  
  export const customers: Customer[] = [
    {
      id: 'CUS001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      status: 'active',
      dateJoined: '2023-01-15',
    },
    {
      id: 'CUS002',
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      phone: '(555) 234-5678',
      status: 'active',
      dateJoined: '2023-02-20',
    },
    {
      id: 'CUS003',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(555) 345-6789',
      status: 'blocked',
      dateJoined: '2023-03-10',
    },
    {
      id: 'CUS004',
      name: 'Olivia Davis',
      email: 'olivia.davis@example.com',
      phone: '(555) 456-7890',
      status: 'active',
      dateJoined: '2023-04-05',
    },
    {
      id: 'CUS005',
      name: 'William Wilson',
      email: 'william.wilson@example.com',
      phone: '(555) 567-8901',
      status: 'pending',
      dateJoined: '2023-05-12',
    },
    {
      id: 'CUS006',
      name: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      phone: '(555) 678-9012',
      status: 'active',
      dateJoined: '2023-06-18',
    },
    {
      id: 'CUS007',
      name: 'James Anderson',
      email: 'james.anderson@example.com',
      phone: '(555) 789-0123',
      status: 'blocked',
      dateJoined: '2023-07-22',
    },
    {
      id: 'CUS008',
      name: 'Emma Thomas',
      email: 'emma.thomas@example.com',
      phone: '(555) 890-1234',
      status: 'active',
      dateJoined: '2023-08-30',
    },
  ];
  
  export const sampleCustomers: ICustomer[] = [
    {
      _id: 'C001',
      clientId: 'CLIENT001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      isBlocked: false,
      joinedDate: '2023-01-15'
    },
    {
      _id: 'C002',
      clientId: 'CLIENT002',
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      phone: '(555) 234-5678',
      isBlocked: false,
      joinedDate: '2023-02-20'
    },
    {
      _id: 'C003',
      clientId: 'CLIENT003',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(555) 345-6789',
      isBlocked: true,
      joinedDate: '2023-03-10'
    },
    {
      _id: 'C004',
      clientId: 'CLIENT004',
      name: 'Olivia Davis',
      email: 'olivia.davis@example.com',
      phone: '(555) 456-7890',
      isBlocked: false,
      joinedDate: '2023-04-05'
    },
    {
      _id: 'C005',
      clientId: 'CLIENT005',
      name: 'William Wilson',
      email: 'william.wilson@example.com',
      phone: '(555) 567-8901',
      isBlocked: false,
      joinedDate: '2023-05-12'
    },
    {
      _id: 'C006',
      clientId: 'CLIENT006',
      name: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      phone: '(555) 678-9012',
      isBlocked: false,
      joinedDate: '2023-06-18'
    },
    {
      _id: 'C007',
      clientId: 'CLIENT007',
      name: 'James Anderson',
      email: 'james.anderson@example.com',
      phone: '(555) 789-0123',
      isBlocked: true,
      joinedDate: '2023-07-22'
    },
    {
      _id: 'C008',
      clientId: 'CLIENT008',
      name: 'Emma Thomas',
      email: 'emma.thomas@example.com',
      phone: '(555) 890-1234',
      isBlocked: false,
      joinedDate: '2023-08-30'
    },
  ];