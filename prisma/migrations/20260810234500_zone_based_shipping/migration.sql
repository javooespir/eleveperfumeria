-- AlterTable
ALTER TABLE "Order" DROP COLUMN "distanceKm",
ADD COLUMN     "zone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShippingConfig" DROP COLUMN "baseShippingCost",
DROP COLUMN "freeShippingRadiusKm";
