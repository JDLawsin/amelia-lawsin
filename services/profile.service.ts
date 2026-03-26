import { prisma } from "@/lib/prisma";

export const getRole = async (id: string) => {
  return prisma.profile.findFirst({
    where: {
      id,
    },
    select: {
      role: true,
    },
  });
};
