import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}