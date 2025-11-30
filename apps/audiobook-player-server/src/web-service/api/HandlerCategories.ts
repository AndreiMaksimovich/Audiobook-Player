import {Response, Request} from 'express';
import {audiobookProvider} from "../../core";
import {Status} from "../Types";

export const handlerCategories = async (req: Request, res: Response) => {
    try {
        res.status(Status.OK).json(await audiobookProvider.getCategories());
    } catch (error) {
        console.log(error);
        res.status(Status.INTERNAL_ERROR).json(error);
    }
}
