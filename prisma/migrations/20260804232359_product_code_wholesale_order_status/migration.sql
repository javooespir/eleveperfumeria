-- AlterTable
ALTER TABLE "Product" ADD COLUMN "productCode" TEXT;
ALTER TABLE "Product" ADD COLUMN "wholesalePrice" REAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "distanceKm" REAL NOT NULL,
    "buyerType" TEXT NOT NULL DEFAULT 'minorista',
    "itemsJson" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "shippingCost" REAL NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE_CONFIRMACION',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Order" ("address", "createdAt", "customerName", "distanceKm", "id", "itemsJson", "phone", "shippingCost", "status", "subtotal", "total") SELECT "address", "createdAt", "customerName", "distanceKm", "id", "itemsJson", "phone", "shippingCost", "status", "subtotal", "total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
