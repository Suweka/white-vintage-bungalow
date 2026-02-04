import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock admin users database - Replace with real database query
const ADMIN_USERS = [
  {
    id: 1,
    name: 'Jaylan Dorwart',
    email: 'admin@lodgify.com',
    password: 'admin123', // In production, use hashed passwords
    role: 'admin',
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@lodgify.com',
    password: 'manager123',
    role: 'manager',
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = ADMIN_USERS.find(
      (user) => user.email === email && user.password === password
    );

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token and user info
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie for additional security
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
