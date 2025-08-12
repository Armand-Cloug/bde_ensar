import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

const userSchema = z.object({
  firstName: z.string().min(1, "Veuillez saisir votre prénom").max(100),
  lastName:  z.string().min(1, "Veuillez saisir votre nom").max(100),
  email:     z.string().min(1, "Veuillez saisir votre email").email("Email invalide"),
  password:  z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = userSchema.parse(body);

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ user: null, message: "Email already used" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        // role: "utilisateur",
        // isAdherent: false,
      },
    });

    const { password: _pw, ...rest } = newUser;
    return NextResponse.json({ user: rest, message: "User creation succeeded" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "user creation failed" }, { status: 500 });
  }
}
