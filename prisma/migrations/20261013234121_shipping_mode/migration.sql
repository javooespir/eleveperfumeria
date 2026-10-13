-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "zone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShippingConfig" ADD COLUMN     "shippingMode" TEXT NOT NULL DEFAULT 'zonas';
