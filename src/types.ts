export interface Order{
    order: 'ASC' | 'DESC';
    by: string;
}
export interface PaginationFilter {
    order? : Order;
    skip? : number;
    limit? : number;
};

export type Votable = "Post" | "Comment";

export type VoteValue = 1 | -1;