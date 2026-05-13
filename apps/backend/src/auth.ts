import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { JWT_SECRET } from '../config';

interface TokenPayload {
  userId: string;
}

const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = generateToken({ userId: user._id.toString() });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ error: 'Invalid password' });
    }
    const token = generateToken({ userId: user._id.toString() });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

export { authenticate, signup, login };