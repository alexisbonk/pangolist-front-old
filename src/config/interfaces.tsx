export interface UserInterface
{
    id: string;
    email: string;
    name: string;
    img?: string;   
}

export interface ContributorInterface
{
    id: string;
    amount: number;
    user: UserInterface;
    createdAt: string;
    updatedAt: string;
}

export interface GiftInterface
{
    id: string;
    img: string;
    title: string;
    description?: string;
    price: number;
    currentPrice: number;
    contributors: ContributorInterface[];
    createdAt: string;
    updatedAt: string;
}

export interface ListInterface
{
    id: string;
    img?: string;
    title: string;
    description?: string;
    creator: UserInterface;
    location: string;
    deadline: string;
    gifts: GiftInterface[];
    users: UserInterface[];
    createdAt: string;
    updatedAt: string;
}