import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const databaseUrl = new URL(process.env.DATABASE_URL!);

  // pg currently treats these modes as verify-full, but warns until that intent
  // is explicit. Preserve the secure behavior while keeping older .env values
  // working during the transition.
  if (["prefer", "require", "verify-ca"].includes(databaseUrl.searchParams.get("sslmode") ?? "")) {
    databaseUrl.searchParams.set("sslmode", "verify-full");
  }

  const connectionString = databaseUrl.toString();
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
