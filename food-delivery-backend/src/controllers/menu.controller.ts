import { Request, Response } from "express";
import { menuItems } from "../lib/menu-data";
import { ApiResponse, MenuItem } from "../lib/types";

export function getMenu(_req: Request, res: Response): void {
  const response: ApiResponse<MenuItem[]> = {
    success: true,
    data: menuItems,
  };
  res.status(200).json(response);
}
