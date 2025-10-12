```txt
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   BRANDS    │         │  CATEGORIES  │         │  CUSTOMERS  │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)     │
│ name        │         │ name (enum)  │         │ first_name  │
│ created_at  │         │ created_at   │         │ last_name   │
│ updated_at  │         │ updated_at   │         │ email       │
└──────┬──────┘         └──────┬───────┘         │ phone       │
       │                       │                 │ address     │
       │                       │                 │ ...         │
       │                       │                 └──────┬──────┘
       │ 1                     │ 1                      │ 1
       │                       │                        │
       │         ┌─────────────┴───────┐                │
       │         │                     │                │
       └─────────┤     PRODUCTS        ├────────────────┘
               N │                     │ N
                 ├─────────────────────┤
                 │ id (PK)             │
                 │ name                │
                 │ sku (unique)        │
                 │ price               │
                 │ stock_quantity      │
                 │ category_id (FK)    │
                 │ brand_id (FK)       │
                 └──────┬──────────────┘
                        │ 1
                        │
              ┌─────────┴──────────┐
              │                    │
              │ N                N │
    ┌─────────┴─────────┐   ┌─────┴──────────┐
    │   ORDER_ITEMS     │   │    REVIEWS     │
    ├───────────────────┤   ├────────────────┤
    │ id (PK)           │   │ id (PK)        │
    │ order_id (FK)     │   │ product_id(FK) │
    │ product_id (FK)   │   │ customer_id(FK)│
    │ quantity          │   │ rating (1-5)   │
    │ price             │   │ comment        │
    └─────────┬─────────┘   └────────────────┘
              │ N
              │
              │ 1
       ┌──────┴──────┐
       │   ORDERS    │
       ├─────────────┤
       │ id (PK)     │
       │ customer_id │
       │ order_date  │
       │ status      │
       │ total       │
       └─────────────┘
```
