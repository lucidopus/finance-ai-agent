import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { z } from 'zod';

const signinSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, password, rememberMe } = signinSchema.parse(body);

    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET!;
    const expireDays = rememberMe ? parseInt(process.env.JWT_REMEMBER_DAYS || '30') : parseInt(process.env.JWT_EXPIRE_DAYS || '1');
    const expirationTime = expireDays * 24 * 60 * 60 * 1000; // in milliseconds

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      jwtSecret,
      { expiresIn: `${expireDays}d` }
    );

    // Set HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expirationTime / 1000, // in seconds
    };

    const response = NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    response.cookies.set('auth-token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Signin error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}