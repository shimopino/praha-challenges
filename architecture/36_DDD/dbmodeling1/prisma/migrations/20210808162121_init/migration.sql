-- CreateTable
CREATE TABLE "tax_category" (
    "id" SERIAL NOT NULL,
    "taxCategoryName" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rate_range" (
    "id" SERIAL NOT NULL,
    "appliedStateDate" TEXT NOT NULL,
    "appliedEndDate" TEXT NOT NULL,
    "taxCategoryId" INTEGER NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "normalPrice" DECIMAL(65,30) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "taxCategoryId" INTEGER NOT NULL,
    "isSetItem" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_category" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "set_item_component" (
    "setItemId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "isPayed" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_detail" (
    "orderId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "appliedTaxRate" DOUBLE PRECISION NOT NULL,
    "appliedPrice" DECIMAL(65,30) NOT NULL,
    "containWasabi" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "customer.phone_unique" ON "customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "SetItemComponent_unique_key" ON "set_item_component"("setItemId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderDetail_unique_key" ON "order_detail"("orderId", "itemId");

-- AddForeignKey
ALTER TABLE "tax_rate_range" ADD FOREIGN KEY ("taxCategoryId") REFERENCES "tax_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD FOREIGN KEY ("categoryId") REFERENCES "item_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD FOREIGN KEY ("taxCategoryId") REFERENCES "tax_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "set_item_component" ADD FOREIGN KEY ("setItemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "set_item_component" ADD FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_detail" ADD FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_detail" ADD FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
