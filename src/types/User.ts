interface Address {
  address: string;
  city: string;
  state: string;
  country: string;
}

interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

interface PostComment {
  id: number;
  body: string;
  userId: number;
}

interface Post {
  id: number;
  image: string;
  comments: PostComment[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  address: Address;
  university?: string;
  company?: Company;
  role?: string;
  posts: Post[];
}

export type { User, Address, Company, Post, PostComment };
