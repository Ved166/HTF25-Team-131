import { storage } from "../server/storage";

async function createSuperAdmin() {
  try {
    const admin = await storage.createAdmin({
      email: "admin@cheesecakeclub.com",
      password: "admin123", // Change this in production!
      name: "Super Admin",
      isSuper: true,
      clubId: null
    });
    console.log("Created super admin:", admin);
  } catch (error) {
    console.error("Failed to create super admin:", error);
  }
}

createSuperAdmin();