/*
  Warnings:

  - You are about to drop the column `followerId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `Follow` table. All the data in the column will be lost.
  - Added the required column `followerEmail` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingEmail` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Follow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "followerEmail" TEXT NOT NULL,
    "followingEmail" TEXT NOT NULL,
    CONSTRAINT "Follow_followerEmail_fkey" FOREIGN KEY ("followerEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Follow_followingEmail_fkey" FOREIGN KEY ("followingEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Follow" ("id") SELECT "id" FROM "Follow";
DROP TABLE "Follow";
ALTER TABLE "new_Follow" RENAME TO "Follow";
CREATE UNIQUE INDEX "Follow_followerEmail_followingEmail_key" ON "Follow"("followerEmail", "followingEmail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
