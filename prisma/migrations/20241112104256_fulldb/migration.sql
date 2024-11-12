-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registration_time" TIMESTAMP(3),
ADD COLUMN     "state" TEXT;

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "manufacturer" INTEGER NOT NULL,
    "original_price" DOUBLE PRECISION NOT NULL,
    "current_price" DOUBLE PRECISION NOT NULL,
    "creation_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "total_purchase" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "ordinal_numbers" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "review_detail" TEXT,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("ordinal_numbers","product_id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "UserCart" (
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserCart_pkey" PRIMARY KEY ("user_id","product_id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "creation_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "order_detail_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("order_detail_id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "payment_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "supplier_id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "Images" (
    "ordinal_numbers" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "directory_path" TEXT,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("ordinal_numbers","product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_manufacturer_fkey" FOREIGN KEY ("manufacturer") REFERENCES "Suppliers"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCart" ADD CONSTRAINT "UserCart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCart" ADD CONSTRAINT "UserCart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
