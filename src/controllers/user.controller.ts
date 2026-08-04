// src/controllers/user.controller.ts
import type { Request, Response } from "express";

const getUsers = (_req: Request, res: Response): void => {
  res.json({
    message: "取得使用者列表",
  });
};

const getUserById = (req: Request, res: Response): void => {
  const { id } = req.params;

  res.json({
    id,
    message: "取得單一使用者",
  });
};

const createUser = (req: Request, res: Response): void => {
  const { name, email } = req.body;

  res.status(201).json({
    message: "新增使用者成功",
    data: {
      name,
      email,
    },
  });
};

export default {
  getUsers,
  getUserById,
  createUser,
};
