export const PrismaErrorCode = {
  SQLITE_UNIQUE_CONSTRAINTS: 'P2002',
} as const;

export type PrismaErrorCode =
  typeof PrismaErrorCode[keyof typeof PrismaErrorCode];
