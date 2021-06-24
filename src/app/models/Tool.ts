import { Tag } from "./Tag";
export interface Tool {
    id: number;
    title: string;
    link: string;
    description: string;
    Tags: Tag[];
}
