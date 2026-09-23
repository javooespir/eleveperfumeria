-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "addressExtra" TEXT,
ADD COLUMN     "locality" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "street" TEXT;

-- AlterTable
ALTER TABLE "ShippingConfig" ADD COLUMN     "metaPixelId" TEXT;
