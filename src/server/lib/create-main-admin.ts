import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "./db";
import { user } from "./db/schema/auth-schema";

const adminEmail = process.env.MAIN_ADMIN_EMAIL
const adminPassword = process.env.MAIN_ADMIN_PASSWORD

async function createMainAdminIfNotExists() {
    if (!adminEmail || !adminPassword){
        throw new Error("Заполните MAIN_ADMIN_PASSWORD и MAIN_ADMIN_EMAIL")
    }

    const existingAdmin = await db.query.user.findFirst({
        where: eq(user.email, adminEmail),
    });

    if (existingAdmin) {
        console.log("Main admin already exists, skipping creation");
        return;
    }

    await auth.api.signUpEmail({
        body: {
            name: "Admin",
            email: adminEmail,
            password: adminPassword,
        },
    });

    await db.update(user).set({role: "admin"}).where(eq(user.email, adminEmail))

    console.log("Admin created");
}

await createMainAdminIfNotExists()