"use server";
import { cookies } from "next/headers";

export async function removeCookie(data) {
  cookies().delete(data);
}
