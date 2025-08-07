import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod"; 

// Define a schema for input validation

const userSchema = z
  .object({
    firstName: z.string().min(1, 'Veuillez saisir votre prénom').max(100),
    name: z.string().min(1, 'Veuillez saisir votre nom').max(100),
    email: z.string().min(1, 'Veuillez saisir votre email').email('Email Invalide'),
    password: z
      .string()
      .min(1, 'Veuillez saisir un mot de passe')
      .min(8, 'Le mot de passe doit faire au moins 8 caractères'),
  })

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, name, email, password } = userSchema.parse(body); 

    // Check fi email is not a duplicate
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "Email already used" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: { 
        firstName: firstName,
        lastName: name,
        email: email,
        password: hashedPassword,
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({ user : rest, message: "User creation sucedeed" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({message: "user creation failed"}, { status: 500 });
  }
}